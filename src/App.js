import "./App.css";
import TopButtons from "./components/TopButtons";
import Inputs from "./components/search/Inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TemperatureAndDetails from "./components/TemperatureAndDetails";
import getFormattedWeatherData from "./services/weatherService";
import { useEffect, useState } from "react";

function App() {
	const [query, setQuery] = useState({ q: "delhi" });
	const [units, setUnits] = useState("metric");
	const [weather, setWeather] = useState(null);

	useEffect(() => {
		const fetchWeather = async () => {
			await getFormattedWeatherData({ ...query, units }).then((data) => {
				setWeather(data);
			});
		};

		fetchWeather();
	}, [query, units]);

	const formatBackground = () => {
		if (!weather) return "from-cyan-500 to-blue-900";

		const threshold1 = units === "metric" ? 20 : 68;
		const threshold2 = units === "metric" ? 30 : 86;

		if (weather.temp <= threshold1) return "from-cyan-500 to-blue-900";
		else if (weather.temp <= threshold2) return "from-cyan-600 to-red-600";

		return "from-red-400 to-yellow-900";
	};

	return (
		<div
			className={`h-screen bg-no-repeat bg-cover bg-bottom mg:bg-fixed flex bg-gradient-to-br ${formatBackground()}`}
		>
			<div
				className={`m-auto w-full bg-black/20 max-w-[600px] min-h-[584px] backdrop-blur-[32px] rounded-[32px] max-w-screen py-12 px-6 h-max shadow-xl shadow-gray-800 `}
			>
				<Inputs setQuery={setQuery} units={units} setUnits={setUnits} />
				<TopButtons setQuery={setQuery} />

				{weather && (
					<div>
						<TimeAndLocation weather={weather} />
						<TemperatureAndDetails weather={weather} />
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
