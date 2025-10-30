import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function SampleNextArrow(props) {
  const { onClick } = props;
  return (
  	<div className="owl-nav">
		<div className="owl-next fas fa-arrow-right"  onClick={onClick}/>
	</div>	
  );
}

function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
		<div className="owl-nav mt-0">
			<div className="owl-prev fas fa-arrow-left" onClick={onClick} style={{zIndex:1}}/>
		</div>
    );
} 

const contentBlog =[
	{},
	{},
	{},
]

const ProfileSlider = () => {
	const settings = {
		dots: false,
		infinite: true,
		arrows: true,
		speed: 500,
		center: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		nextArrow: <SampleNextArrow />,
		prevArrow: <SamplePrevArrow />,
		responsive: [
			{
				breakpoint: 1601,
				settings: {
				  slidesToShow: 1,
				  slidesToScroll: 1,
				},
			},
		],
	};
  return (
    <Slider className="owl-carousel card-slider" {...settings}>
		{contentBlog.map((data,index)=>(
			<div className="owl-items" key={index}>
				<h4 className="fs-20 font-w700 mb-4">Fillow Company Profile Website Project</h4>
				<span className="fs-14 font-w400">
					Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque 
				</span>
			</div>
		))}      
    </Slider>
  );
};

export default ProfileSlider;