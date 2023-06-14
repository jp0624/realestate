import { NavLink } from "react-router-dom"
import styles from "./styles.module.scss"

const BtmNav = () => {
	return (
		<>
			<nav className={`${styles.nav__btm}`}>
				<ul className={`${styles.nav__btm__container}`}>
					<li className={`${styles.nav__btm__container__item}`}>
						<NavLink to='/'>Home</NavLink>
					</li>
					<li className={`${styles.nav__btm__container__item}`}>
						<NavLink to='/map'>Map</NavLink>
					</li>
					<li className={`${styles.nav__btm__container__item}`}>
						<NavLink to='/listings'>Listings</NavLink>
					</li>
				</ul>
			</nav>
		</>
	)
}

export default BtmNav
