import TopNav from "../../navs/TopNav/TopNav"
import styles from "./styles.module.scss"
import { NavLink } from "react-router-dom"

const Header = () => {
	return (
		<>
			<header className={`${styles.header}`}>
				<NavLink to='/' className={`${styles.logo__main}`}>
					<img src='/assets/img/logo/logo-horz.svg' />
				</NavLink>
				<TopNav />
			</header>
		</>
	)
}

export default Header
