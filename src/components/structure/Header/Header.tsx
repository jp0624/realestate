import { NavLink } from "react-router-dom"
import TopNav from "../../navs/TopNav/TopNav"
import styles from "./styles.module.scss"

/**
 * Header component represents the header section of the page.
 * @returns The Header component.
 */
const Header = () => {
	return (
		<>
			<header className={`${styles.header}`}>
				{/* Logo */}
				<NavLink to='/' className={`${styles.logo__main}`}>
					<img src='/assets/img/logo/logo-horz.svg' />
				</NavLink>
				{/* Top navigation */}
				<TopNav />
			</header>
		</>
	)
}

export default Header
