import React, { Component} from "react";
import "../css/Sidebar.css"
class Range extends Component {
    constructor(props) {
        super(props);
        this.updateRange = this.updateRange.bind(this);
    }

    updateRange(event) {
        event.preventDefault();
        this.props.updateRange(event.target.value);

    }

    render() {
        const { range } = this.props;
        return (
            <div className='m-3'>
                <input className='range' type="range"
                       value={range}
                       min="0"
                       max="255"
                       step="1"
                       onChange={this.updateRange}
                />
                <span className='output'>{range}</span>
            </div>
        )
    }
}
export default Range;
