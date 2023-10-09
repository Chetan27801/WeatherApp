import React, { useState } from "react";
import { url, geoApiOptions } from "./Api";
import { AsyncPaginate } from "react-select-async-paginate";
import { UilLocationPoint } from "@iconscout/react-unicons";

function Inputs({ setQuery, units, setUnits }) {
	const [city, setCity] = useState("");

	const handleUnitsChange = (e) => {
		const selectedUnit = e.currentTarget.name;

		if (units !== selectedUnit) setUnits(selectedUnit);
	};

	const handleLocationClick = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				let lat = position.coords.latitude;
				let lon = position.coords.longitude;

				setQuery({
					lat,
					lon,
				});
			});
		}
	};

	const loadOptions = async (input) => {
		return fetch(
			`${url}?minPopulation=100000&namePrefix=${input}`,
			geoApiOptions
		)
			.then((response) => response.json())
			.then((response) => {
				return {
					options: response.data.map((city) => {
						return {
							city: `${city.name}`,
							label: `${city.name}, ${city.countryCode}`,
						};
					}),
				};
			})
			.catch((err) => console.error(err));
	};

	const handleOnChange = (searchData) => {
		setCity(searchData.city);
		setQuery({ q: searchData.city });
	};

	return (
		<div className="flex flex-row justify-center my-3">
			<div className="flex flex-row items-center justify-center space-x-4">
				<AsyncPaginate
					className="text-xl dark:bg-slate-800  mb-2 max-w-[300px] font-light w-full shadow-xl focus:outline-none capitalize placeholder:lowercase rounded-md"
					placeholder="Search for city..."
					debounceTimeout={600}
					value={city.name}
					onChange={handleOnChange}
					loadOptions={loadOptions}
				/>
				<UilLocationPoint
					size={35}
					className="text-white cursor-pointer transition ease-out hover:scale-150"
					onClick={handleLocationClick}
				/>

				<div className="flex flex-row items-center justify-center">
					<button
						name="metric"
						className="text-xl text-white font-light cursor-pointer transition ease-out hover:scale-125"
						onClick={handleUnitsChange}
					>
						°C
					</button>
					<p className="text-xl text-white mx-1">|</p>
					<button
						name="imperial"
						className="text-xl text-white font-light cursor-pointer transition ease-out hover:scale-125"
						onClick={handleUnitsChange}
					>
						°F
					</button>
				</div>
			</div>
		</div>
	);
}

export default Inputs;
