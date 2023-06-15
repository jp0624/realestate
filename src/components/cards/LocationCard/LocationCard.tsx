import styles from "./styles.module.scss"

const LocationCard = ({ location }: any) => {
	return (
		<>
			<li className={`${styles.location__card}`}>{location.address}</li>
		</>
	)
}

export default LocationCard
