import { NavLink } from "react-router-dom"
import styles from "./styles.module.scss"

const TopNav = () => {
	return (
		<>
			<nav className={`${styles.nav__top}`}>
				<ul className={`${styles.nav__top__container}`}>
					<li className={`${styles.nav__top__container__item}`}>
						<NavLink to='/'>Home</NavLink>
					</li>
					<li className={`${styles.nav__top__container__item}`}>
						<NavLink to='/map'>Map</NavLink>
					</li>
				</ul>
			</nav>
		</>
	)
}

export default TopNav
