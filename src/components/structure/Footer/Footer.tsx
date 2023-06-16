import BtmNav from "../../navs/BtmNav/BtmNav"
import styles from "./styles.module.scss"

/**
 * Footer component represents the footer section of the page.
 * @returns The Footer component.
 */
const Footer = () => {
	return (
		<>
			<footer className={`${styles.footer}`}>
				{/* Bottom navigation */}
				<BtmNav />
			</footer>
		</>
	)
}

export default Footer
