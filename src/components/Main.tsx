import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Main() {
	var settings = {
		dots: true,
		infinite: false,
		speed: 300,
		slidesToShow: 1,
		slidesToScroll: 1,
	};

	return (
		<div className="flex flex-row justify-between w-full my-16">
			<div className="flex flex-col gap-5">
				<p className="text-white font-bold text-lg">Powered by Polygon zkEVM</p>
				<svg xmlns="http://www.w3.org/2000/svg" width="625" height="178" viewBox="0 0 625 178" fill="none">
					<path
						d="M0 176.806L57.3931 96.4514L56.6787 118.32L1.66702 40H43.3425L78.1118 91.1114L62.3942 91.62L98.3542 40H139.792L82.6365 117.557V96.1972L139.792 176.806H97.6397L61.2034 122.389L76.6829 124.677L40.4848 176.806H0Z"
						fill="#BB86FC"
					/>
					<path
						d="M152.954 178V0H184.866L283.22 128.16H267.74V0H305.844V178H274.17L175.578 49.84H191.057V178H152.954Z"
						fill="#BB86FC"
					/>
					<path
						d="M381.007 80.1H461.024V113.157H381.007V80.1ZM383.865 178H345.285V0H471.264V33.0571H383.865V178Z"
						fill="#BB86FC"
					/>
					<path d="M533.076 178V33.5657H479.731V0H625V33.5657H571.655V178H533.076Z" fill="#BB86FC" />
				</svg>
				<p className="text-white font-bold text-lg">Mint conditions: 1000 APE on Ethereum network</p>
			</div>
			<div className="w-[402px] rounded-xl flex flex-col">
				<Slider {...settings}>
					<div className="bg-secondary h-[254px] text-center p-[100px] rounded-xl">1</div>
					<div className="bg-secondary h-[254px] text-center p-[100px]  rounded-xl">2</div>
					<div className="bg-secondary h-[254px] text-center p-[100px]  rounded-xl">3</div>
				</Slider>
			</div>
		</div>
	);
}
