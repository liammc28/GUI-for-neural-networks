import PropTypes from 'prop-types';
import React from 'react';
import "../css/Classify.css"

export default class Drawing extends React.Component {
    static propTypes = {
        isDrawing: PropTypes.bool.isRequired,
        isEndStroke: PropTypes.bool.isRequired,
        strokes: PropTypes.arrayOf(
            PropTypes.arrayOf(PropTypes.shape({ x: PropTypes.number, y: PropTypes.number })),
        ).isRequired,
        addStroke: PropTypes.func.isRequired,
        addStrokePos: PropTypes.func.isRequired,
        endStroke: PropTypes.func.isRequired,
        addInput: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.canvas = null;
        this.ctx = null;
    }

    componentDidMount() {
        this.initContext();
    }

    componentDidUpdate() {
        this.initContext();
        this.drawStrokes();

        const { isEndStroke, addInput } = this.props;

        if (isEndStroke) {
            addInput(this.ctx.getImageData(0, 0, 280, 280));
        }
    }

    onMouseDown = (e) => {
        const { addStroke } = this.props;
        addStroke(this.computeMousePos(e));
    };

    onMouseMove = (e) => {
        const { isDrawing, addStrokePos } = this.props;

        if (!isDrawing) {
            return;
        }

        addStrokePos(this.computeMousePos(e));
    };

    onStrokeEnd = () => {
        const { isDrawing, endStroke } = this.props;

        if (isDrawing) {
            endStroke();
        }
    };

    setCanvasRef = (elt) => {
        this.canvas = elt;
    };

    initContext() {
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineWidth = 10;
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = 'white';

        this.ctx.fillStyle = 'dark';
        this.ctx.className('canvas');

        this.clearCanvas();
    }

    clearCanvas() {
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    computeMousePos(e) {
        return {
            x: this.computeMousePosX(e),
            y: this.computeMousePosY(e),
        };
    }

    computeMousePosX(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;

        return (e.clientX - rect.left) * scaleX;
    }

    computeMousePosY(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleY = this.canvas.height / rect.height;

        return (e.clientY - rect.top) * scaleY;
    }

    drawStrokes() {
        const { strokes } = this.props;

        for (let j = 0; j < strokes.length; j += 1) {
            const points = strokes[j];

            this.ctx.beginPath();
            this.ctx.moveTo(points[0].x, points[0].y);

            for (let i = 1; i < points.length; i += 1) {
                this.ctx.lineTo(points[i].x, points[i].y);
            }
            this.ctx.stroke();
        }
    }

    render() {
        return (
                <canvas
                    ref={this.setCanvasRef}
                    onPointerDown={this.onMouseDown}
                    onPointerMove={this.onMouseMove}
                    onPointerUp={this.onStrokeEnd}
                    onMouseLeave={this.onStrokeEnd}
                    width="280"
                    height="280"
                />
        );
    }
}
