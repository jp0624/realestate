import { useCommentsContext } from "../../../helpers/GetComments"
import styles from "./styles.module.scss"
import { format } from "date-fns"

const CommentsPanel = ({ id }: any) => {
	const { getCommentsById, addComment } = useCommentsContext()

	const locationComments = getCommentsById(id) || []
	console.log("locationComments: ", locationComments)

	return (
		<>
			<h2 className={`${styles.comments__heading}`}>Add a Comment</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					const title = e.target.elements.title.value
					const text = e.target.elements.comment.value
					const rating = parseInt(e.target.elements.rating.value)
					const name = e.target.elements.name.value
					const timestamp = new Date()
					const formattedTimestamp = format(
						timestamp,
						"MMM dd, yyyy (hh:mm a)"
					)
					const newComment = {
						title,
						text,
						rating,
						name,
						timestamp: formattedTimestamp,
						location: id,
					}
					addComment(newComment)
					e.target.reset()
				}}
			>
				<ul className={`${styles.comments__form}`}>
					<li>
						<label htmlFor='comment-name'>Name:</label>
						<input
							type='text'
							id='comment-name'
							name='name'
							placeholder='Your name'
						/>
					</li>
					<li>
						<label htmlFor='comment-title'>Title:</label>
						<input
							type='text'
							id='comment-title'
							name='title'
							placeholder='Enter title'
						/>
					</li>
					<li>
						<label htmlFor='comment-text'>Comment:</label>
						<textarea
							name='comment'
							id='comment-text'
							placeholder='Type your comment here..'
						/>
					</li>
					<li>
						<label htmlFor='comment-rating'>Rating:</label>
						<select name='rating' id='comment-rating'>
							<option value='0'>0</option>
							<option value='1'>1</option>
							<option value='2'>2</option>
							<option value='3'>3</option>
							<option value='4'>4</option>
							<option value='5'>5</option>
						</select>
					</li>
					<li>
						<button type='submit'>Post Comment</button>
					</li>
				</ul>
			</form>

			<h2 className={`${styles.comments__heading}`}>Comments</h2>
			{locationComments.length == 0 && <p>No comments to display</p>}
			{locationComments.length > 0 && (
				<ul className={`${styles.comments__container}`}>
					{locationComments.map((comment: any, index: any) => (
						<li
							key={index}
							className={`${styles.comments__comment}`}
						>
							<h3
								className={`${styles.comments__comment__title}`}
							>
								{comment.title}
							</h3>
							<h4 className={`${styles.comments__comment__time}`}>
								{comment.timestamp}
							</h4>
							<p className={`${styles.comments__comment__text}`}>
								{comment.text}
							</p>
							<p
								className={`${styles.comments__comment__rating}`}
							>
								Rating: {comment.rating}
							</p>
							<p
								className={`${styles.comments__comment__author}`}
							>
								By: {comment.name}
							</p>
						</li>
					))}
				</ul>
			)}
		</>
	)
}

export default CommentsPanel
