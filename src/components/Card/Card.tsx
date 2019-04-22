import * as React from "react";

interface Props {
    plain?: boolean,
    hCenter?: boolean,
    icon?: string,
    title?: string,
    ctTableFullWidth?: boolean,
    ctTableResponsive?: boolean,
    content: any
}
interface State {}

class Card extends React.Component<Props, State> {
    render() {
        return (
            <div className={"card" + this.props.plain ? "card-plain" : ""}>
                <div className={"card-header" + (this.props.hCenter ? " text-center" : "")}>
                    <i className={this.props.icon} />
                    <h4 className="title">{this.props.title}</h4>
                </div>
                <div className={
                    "content-" + 
                    (this.props.ctTableFullWidth ? "table-full-width" : "") +
                    (this.props.ctTableResponsive ? "table-responsive" : "")
                }>
                    {this.props.content}
                </div>
            </div>
        )
    }
}

export default Card;