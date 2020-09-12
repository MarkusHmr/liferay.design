/** @jsx jsx */

import { jsx, Grid } from 'theme-ui'
import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Container } from 'components/atoms'
import { CardDefault } from 'components/molecules'
import { makeAuthorSlug, avatarPath } from 'utils'

export default ({ teammate, currentPost, ...props }) => {
	const data = useStaticQuery(graphql`
		{
			allMdx(
				filter: {
					fileAbsolutePath: { regex: "/(articles)/" }
					frontmatter: { publish: { eq: true } }
				}
				sort: { order: DESC, fields: [frontmatter___date] }
			) {
				edges {
					node {
						id
						timeToRead
						frontmatter {
							title
							featuredImage
							author {
								id
							}
						}
						fields {
							slug
						}
					}
				}
			}
		}
	`)

	const Posts = data.allMdx.edges
		.filter(
			edges =>
				makeAuthorSlug(edges.node.frontmatter.author.id) === teammate &&
				edges.node.id !== currentPost,
		)
		.slice(0, 3)
		.map(({ node }) => (
			<CardDefault
				avatarImage
				key={node.id}
				imageURL={node.frontmatter.featuredImage}
				link={node.fields.slug}
				title={node.frontmatter.title}
				subtitle={`${node.timeToRead}` + ' Min Read'}
				avatarImageURL={avatarPath(node.frontmatter.author.id)}
			/>
		))

	return (
		<div>
			{Posts.length >= 1 ? (
				<Container
					{...props}
					sx={{ color: 'black' }}
					padding="4rem 0 4rem"
					background='white'
				>
					<Grid sx={{ variant: 'grids.threeCards' }}>{Posts}</Grid>
				</Container>
			) : null}
		</div>
	)
}
