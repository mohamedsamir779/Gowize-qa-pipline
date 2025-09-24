import { MetaTags } from "react-meta-tags";
import { Container } from "reactstrap";
import { TVChartContainer } from "./tradingviewChart";

function TVTrader() {
	return (
		<>
			<MetaTags>
				<title>{"Tradingview"}</title>
			</MetaTags>
			<Container style={{ 
				marginTop: "80px"
				}}>
				<div style={{
					height: "auto",
					paddingTop: "10px"
				}}>
					<TVChartContainer/>
				</div>

			</Container>

		</>);
}

export default TVTrader;