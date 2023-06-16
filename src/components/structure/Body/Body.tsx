import styles from "./styles.module.scss"
import { Fade } from "react-slideshow-image"
import "react-slideshow-image/dist/styles.css"

/**
 * Body component represents the main content section of the page.
 * @param children - The child components to be rendered within the Body component.
 * @param page - The current page type.
 * @returns The Body component.
 */
const Body = ({
	children,
	page,
}: {
	children: React.ReactNode
	page: string
}) => {
	// Define variables
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
	const interriorClass = styles.article__interrior

	return (
		<>
			<article
				className={`article ${
					page === "home" ? homeClass : interriorClass
				} customScroll`}
			>
				{/* Render slideshow if the page is "home" */}
				{page === "home" && (
					<div className={`${styles.slide__container}`}>
						<Fade arrows={false} pauseOnHover={false}>
							{fadeImages.map((fadeImage, index) => (
								<div key={index}>
									<img
										style={{ width: "100%" }}
										src={fadeImage.url}
										alt={`Slide ${index + 1}`}
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
