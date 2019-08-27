const colours =  [
    "#ce7d78" , "#ea9e70" , "#a48a9e" , "#c6e1e8" , "#648177" ,
    "#f205e6" ,"#1c0365" ,"#14a9ad" ,"#4ca2f9" ,"#a4e43f" ,"#d298e2" ,"#6119d0",
    "#d2737d" ,"#c0a43c" ,"#f2510e"  ,"#79806e" ,"#61da5e" ,"#cd2f00" ,
    "#9348af" ,"#01ac53" ,"#c5a4fb" ,"#996635","#b11573" ,"#4bb473" ,"#75d89e" ,
    "#2f7b99" ,"#da967d" ,"#34891f" ,"#b0d87b" ,"#ca4751" ,"#7e50a8" ,
    "#c4d647" ,"#11dec1" ,"#289812" ,"#ffdbe1",
    "#935b6d" ,"#916988" ,"#aead3a" , "#9e6d71", "#4b5bdc", "#0cd36d",
];

export function selectColor() {
    return colours[Math.floor(Math.random() * colours.length)];
}

export function epochAccuracyData() {
    const color = selectColor();
    const colorVal = selectColor();

    return {
        labels: [],
        datasets:[
            {
                label: 'Validation Accuracy',
                lineTension:0,
                backgroundColor: colorVal,
                borderColor: colorVal,
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(150,99,132,0.4)',
                hoverBorderColor: 'grey',
                data: [],
                fill: false
            },
            {
                label: 'Accuracy',
                lineTension:0,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(150,99,132,0.4)',
                hoverBorderColor: 'green',
                data: [],
                fill: false
            }]
    }
}
export function epochLossData() {
    const color = selectColor();
    const colorVal = selectColor();
    return {
        labels: [],
        datasets:[
            {
                label: 'Validation Loss',
                lineTension:0,
                backgroundColor: colorVal,
                borderColor: colorVal,
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(150,99,132,0.4)',
                hoverBorderColor: 'grey',
                data: [],
                fill: false
            },
            {
                label: 'Loss',
                lineTension:0,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(150,99,132,0.4)',
                hoverBorderColor: 'green',
                data: [],
                fill: false
            }]
    }
}

export function batchAcc() {
    const color = selectColor();

    return {
        labels: [],
        datasets:[{
            label: 'test',
            lineTension:0,
            pointRadius:0,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(150,99,132,0.4)',
            hoverBorderColor: 'grey',
            data: [],
            fill: false
        }]
    }
}

export function batchLoss() {
    const color = selectColor();

    return {
        labels: [],
        datasets:[{
            label: 'batch loss',
            lineTension:0,
            pointRadius:0,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(150,99,132,0.4)',
            hoverBorderColor: 'grey',
            data: [],
            fill: false
        }]
    }
}


export function stateColor() {
    return {
        labels: [],
        datasets:[
            {
                label: 'Validation Loss',
                lineTension:0,
                backgroundColor: colorVal,
                borderColor: colorVal,
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(150,99,132,0.4)',
                hoverBorderColor: 'grey',
                data: [],
                fill: false
            },
            {
                label: 'Loss',
                lineTension:0,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(150,99,132,0.4)',
                hoverBorderColor: 'green',
                data: [],
                fill: false
            }]
    }
}
