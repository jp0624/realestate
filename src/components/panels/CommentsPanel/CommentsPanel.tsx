import { useCommentsContext } from "../../../helpers/GetComments"
import styles from "./styles.module.scss"
import { format } from "date-fns"
import React, { useEffect } from "react"

/**
 * CommentsPanel component displays comments and allows users to add new comments.
 * @param id - The ID of the location.
 * @returns The CommentsPanel component.
 */
const CommentsPanel = ({ id }: { id: string }) => {
	const { getCommentsById, addComment } = useCommentsContext()

	const locationComments = getCommentsById(id) || []

	useEffect(() => {
		const inputs = document.querySelectorAll<HTMLInputElement>(
			"form input, form textarea"
		)
		inputs.forEach((input) => {
			input.addEventListener("keyup", handleFieldChange)
			input.addEventListener("blur", handleFieldChange)
		})

		return () => {
			inputs.forEach((input) => {
				input.removeEventListener("keyup", handleFieldChange)
				input.removeEventListener("blur", handleFieldChange)
			})
		}
	}, [])

	const handleFieldChange = (e: Event) => {
		const target = e.target as HTMLInputElement
		const parentLi = target.closest("li")
		if (parentLi) {
			if (target.value.trim() !== "") {
				parentLi.classList.remove("error")
			} else {
				parentLi.classList.add("error")
			}
		}
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const target = e.target as HTMLFormElement
		const title = (target.elements.namedItem("title") as HTMLInputElement)
			?.value
		const text = (target.elements.namedItem("comment") as HTMLInputElement)
			?.value
		const rating = parseInt(
			(target.elements.namedItem("rating") as HTMLSelectElement)?.value
		)
		const name = (target.elements.namedItem("name") as HTMLInputElement)
			?.value

		// Check if any field is empty
		if (!title || !text || !name) {
			// Add 'error' class to the parent 'li' of empty fields
			if (!title) {
				;(target.elements.namedItem("title") as HTMLElement)
					?.closest("li")
					?.classList.add("error")
			}
			if (!text) {
				;(target.elements.namedItem("comment") as HTMLElement)
					?.closest("li")
					?.classList.add("error")
			}
			if (!name) {
				;(target.elements.namedItem("name") as HTMLElement)
					?.closest("li")
					?.classList.add("error")
			}
			return // Do not submit the form if any field is empty
		}

		const timestamp = new Date()
		const formattedTimestamp = format(timestamp, "MMM dd, yyyy (hh:mm a)")
		const newComment = {
			title,
			text,
			rating,
			name,
			timestamp: formattedTimestamp,
			location: id,
		}

		addComment(newComment)
		target.reset()
	}

	return (
		<>
			<h2 className={`${styles.comments__heading}`}>Add a Comment</h2>
			<p>* Indicates required fields</p>
			<form onSubmit={handleSubmit}>
				<ul className={`${styles.comments__form}`}>
					<li>
						<label htmlFor='comment-name'>* Name:</label>
						<input
							type='text'
							id='comment-name'
							name='name'
							placeholder='Your name'
						/>
						<em>This is a required field</em>
					</li>
					<li>
						<label htmlFor='comment-title'>* Title:</label>
						<input
							type='text'
							id='comment-title'
							name='title'
							placeholder='Enter title'
						/>
						<em>This is a required field</em>
					</li>
					<li>
						<label htmlFor='comment-text'>* Comment:</label>
						<textarea
							name='comment'
							id='comment-text'
							placeholder='Type your comment here..'
						/>
						<em>This is a required field</em>
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
			{locationComments.length === 0 && <p>No comments to display</p>}
			{locationComments.length > 0 && (
				<ul className={`${styles.comments__container}`}>
					{locationComments.map((comment: any, index: number) => (
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
