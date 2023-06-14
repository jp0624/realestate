import BtmNav from "../../navs/BtmNav/BtmNav"
import styles from "./styles.module.scss"

const Footer = () => {
	return (
		<>
			<footer className={`${styles.footer}`}>
				<BtmNav />
			</footer>
		</>
	)
}

export default Footer
