import  React from "react"
import {Button, Row,ButtonGroup, Col} from "reactstrap";
import "../css/Classify.css";
const styles = {
    canvas : {
        border:'1px solid #333',
        margin:'20px 0px'
    },
    mnist_output : {
        border:'1px solid #333',
    }
};
class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: ''
        }
    }
    componentDidMount() {
        this.reset()
    }
    drawing(e) {
        if (this.state.pen === 'down') {
            this.ctx.beginPath();
            this.ctx.lineWidth = this.state.lineWidth;
            this.ctx.lineCap = 'round';
            if (this.state.mode === 'draw') {
                this.ctx.strokeStyle = this.state.penColor
            }
            this.ctx.moveTo(this.state.penCoords[0], this.state.penCoords[1]);
            this.ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            this.ctx.stroke();
            this.setState({
                penCoords: [e.nativeEvent.offsetX, e.nativeEvent.offsetY]
            })
        }
    }
    penDown(e) {
        this.setState({
            pen: 'down',
            penCoords: [e.nativeEvent.offsetX, e.nativeEvent.offsetY]
        })
    }
    penUp() {
        this.setState({
            pen: 'up'
        })
    }

    scaleDown() {
        const originalCanvas = this.refs.canvas;
        const boundedCanvas = this.refs.bounded;
        const mnistCanvas = this.refs.mnist;
        const originalCtx = originalCanvas.getContext('2d');
        const boundedCtx = boundedCanvas.getContext('2d');
        const mnistCtx = mnistCanvas.getContext('2d');
        const imgData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        const data = imgData.data;
        const pixels = [[]];
        let row = 0;
        let column = 0;
        for (let i = 0; i < originalCanvas.width * originalCanvas.height * 4; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3] / 255;
            if (column >= originalCanvas.width) {
                column = 0;
                row++;
                pixels[row] = [];
            }
            pixels[row].push(Math.round(a * 200) / 200);
            column++;
        }
        const boundingRectangle = this.getBoundingRectangle(pixels);
        const array = pixels.reduce(
            (arr, row) => [].concat(arr, row.reduce(
                (concatedRow, alpha) => [].concat(concatedRow, [0, 0, 0, alpha * 255]), []))
            , []);
        const clampedArray =  new Uint8ClampedArray(array);
        const bounded = new ImageData(clampedArray, boundedCanvas.width, boundedCanvas.height);
        boundedCtx.putImageData(bounded, 0, 0);
        boundedCtx.beginPath();
        boundedCtx.lineWidth= '1';
        boundedCtx.strokeStyle= 'red';
        boundedCtx.rect(
            boundingRectangle.minX,
            boundingRectangle.minY,
            Math.abs(boundingRectangle.minX - boundingRectangle.maxX),
            Math.abs(boundingRectangle.minY - boundingRectangle.maxY),
        );
        boundedCtx.stroke();
        // Vector that shifts an image to the center of the mass.
        const trans = this.centerImage(pixels); // [dX, dY] to center of mass
        let brW = boundingRectangle.maxX + 1 - boundingRectangle.minX;
        let brH = boundingRectangle.maxY + 1 - boundingRectangle.minY;
        const scalingFactor = 20 / Math.max(brW, brH);
        // Reset the drawing.
        let img = mnistCtx.createImageData(200, 200);
        for (var i = img.data.length; --i >= 0; )
            img.data[i] = 0;
        mnistCtx.putImageData(img, 200, 200);
        // Reset the tranforms
        mnistCtx.setTransform(1, 0, 0, 1, 0, 0);
        // Clear the canvas.
        mnistCtx.clearRect(0, 0, mnistCanvas.width, mnistCanvas.height);
        mnistCtx.beginPath();
        mnistCtx.lineWidth= '1';
        mnistCtx.strokeStyle= 'green';
        mnistCtx.rect(4, 4, 20, 20);
        mnistCtx.stroke();
        mnistCtx.translate(
            -brW * scalingFactor / 2,
            -brH * scalingFactor / 2
        );
        mnistCtx.translate(
            mnistCtx.canvas.width / 2,
            mnistCtx.canvas.height / 2
        );
        mnistCtx.translate(
            -Math.min(boundingRectangle.minX, boundingRectangle.maxX) * scalingFactor,
            -Math.min(boundingRectangle.minY, boundingRectangle.maxY) * scalingFactor
        );
        mnistCtx.scale(scalingFactor, scalingFactor);
        mnistCtx.drawImage(originalCtx.canvas, 0, 0);
        const imgDatamnist =this.refs.mnist.getContext('2d').getImageData(0,0,28,28);
        const dataGrayscale = [];
        const datamnist = imgDatamnist.data;
        for (let i = 0; i < imgDatamnist.width * imgDatamnist.height; i += 1) {
            const j = i * 4;
            const avg = (datamnist[j + 0] + datamnist[j + 1] + datamnist[j + 2]) / 3;
            const normalized = avg / 255.0;
            dataGrayscale.push(normalized);
        }
        this.props.handlePrediction(dataGrayscale);
    }

    getBoundingRectangle(img) {
        const threshold = 0.01;
        const rows = img.length;
        const columns= img[0].length;
        let minX = columns;
        let minY = rows;
        let maxX = -1;
        let maxY = -1;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < columns; x++) {
                if (img[y][x] > 1 -  threshold) {
                    if (minX > x) minX = x;
                    if (maxX < x) maxX = x;
                    if (minY > y) minY = y;
                    if (maxY < y) maxY = y;
                }
            }
        }
        return { minY, minX, maxY, maxX };
    }
    /**
     * Evaluates center of mass of digit, in order to center it.
     * Note that 1 stands for black and 0 for white so it has to be inverted.
     */
    centerImage(img) {
        var
            meanX     = 0,
            meanY     = 0,
            rows      = img.length,
            columns   = img[0].length,
            pixel     = 0,
            sumPixels = 0,
            y         = 0,
            x         = 0;
        for (y = 0; y < rows; y++) {
            for (x = 0; x < columns; x++) {
                // pixel = (1 - img[y][x]);
                pixel = img[y][x];
                sumPixels += pixel;
                meanY += y * pixel;
                meanX += x * pixel;
            }
        }
        meanX /= sumPixels;
        meanY /= sumPixels;
        const dY = Math.round(rows/2 - meanY);
        const dX = Math.round(columns/2 - meanX);
        return {transX: dX, transY: dY};

    }







    reset() {
        this.setState({
            mode: 'draw',
            pen: 'up',
            lineWidth: 15,
            penColor: 'white',
            image: ''
        });
        this.ctx = this.refs.canvas.getContext('2d');
        this.ctx.fillStyle = "black";
        this.ctx.clearRect(0, 0, 280,280);
        this.ctx.lineWidth = 20;

        this.ctx2 = this.refs.bounded.getContext('2d');
        this.ctx2.clearRect(0, 0, 280,280);

        this.ctx3 = this.refs.mnist.getContext('2d');
        this.ctx3.clearRect(0, 0, 28,28);
        this.props.clear();

    }
    render() {
        return (
            <Row>
                <Col lg={4}/>
                <Col lg={4}>

                <Row>
                    <Col className='prediction'>
                        {this.props.prediction===''?null:
                            <div className='prediction'>
                                Prediction: {this.props.prediction}
                            </div>}
                        <canvas ref="canvas" width="280px" height="280px" style={styles.canvas}
                                onMouseMove={(e)=>this.drawing(e)}
                                onMouseDown={(e)=>this.penDown(e)}
                                onMouseUp={(e)=>this.penUp(e)}>
                        </canvas>
                        <canvas  className='d-none' ref="bounded" width="280px" height="280px" style={styles.canvas}/>
                        <canvas className='d-none' ref="mnist" width="28px" height="28px" style={styles.canvas}/>
                    </Col>
                </Row>
                <Row>
                    <Col className='prediction'>
                        <ButtonGroup>
                            <Button onClick={()=>this.reset()}>Clear</Button>
                            <Button onClick={() => this.scaleDown()}>Predict </Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                </Col>
                <Col lg={4}/>
            </Row>
        )
    }
}
export default Canvas;
