import styles from "./styles.module.scss"
import { Fade } from "react-slideshow-image"
import "react-slideshow-image/dist/styles.css"

console.log("document.title: ", document.title)
const Body = ({ children, page }: any) => {
	let pageClass
	const fadeImages = [
		{
			url: "./assets/img/backgrounds/background-01.jpg",
			caption: "Slide 1",
		},
		{
			url: "./assets/img/backgrounds/background-02.jpg",
			caption: "Slide 2",
		},
	]
	const homeClass = styles.article__home
	const interriorClass = styles.article_interrior
	// const backgroundArr = ["background01.jpg", "background02.jpg"]
	// const backgroundImg =
	// 	backgroundArr[Math.floor(Math.random() * backgroundArr.length)]
	return (
		<>
			<article
				className={`article ${
					page === "home" ? homeClass : interriorClass
				}`}
			>
				{page === "home" && (
					<div className={`${styles.slide__container}`}>
						<Fade arrows={false} pauseOnHover={false}>
							{fadeImages.map((fadeImage, index) => (
								<div key={index}>
									<img
										style={{ width: "100%" }}
										src={fadeImage.url}
									/>
									<h2>{fadeImage.caption}</h2>
								</div>
							))}
						</Fade>
					</div>
				)}
				{children}
			</article>
		</>
	)
}

export default Body
