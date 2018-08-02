import React, { Component } from 'react';

export class ResultsLine extends Component {
    render() {
        return <div class="mobile-client-creation-result">
            <span class={this.props.iconClass || ""} />
            <span class="mobile-client-creation-result-text">
            {this.props.text}
            </span>
            </div>
    }

}