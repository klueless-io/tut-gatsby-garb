import React from 'react'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'

const BlogIndex = ({ data, pageContext }) => {
  const { currentPage, isFirstPage, isLastPage, totalPages } = pageContext
  const nextPage = `/blog/${String(currentPage + 1)}`
  const prevPage =
    currentPage - 1 === 1 ? '/blog' : `/blog/${String(currentPage - 1)}`

  console.log(currentPage)
  console.log(isFirstPage)
  console.log(isLastPage)
  console.log(nextPage)
  console.log(prevPage)
  console.log(totalPages)
  console.log(data)

  return (
    <Layout>
      <div>
        <h1 style={{ display: 'inlineBlock', borderBottom: '1px solid' }}>
          Clothing Blog
        </h1>
        <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <div key={node.id}>
            <h3>
              <Link to={`/posts${node.fields.slug}`}>
                {node.frontmatter.title}
              </Link>
              <span style={{ color: '#bbb' }}> - {node.frontmatter.date}</span>
            </h3>
            <div dangerouslySetInnerHTML={{ __html: node.excerpt }} />
            <hr />
          </div>
        ))}
        {/* Pagination Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            maxWidth: 300,
            margin: '0 auto',
          }}
        >
          {!isFirstPage && (
            <Link to={prevPage} rel="prev">
              Prev Page
            </Link>
          )}
          {/* {isFirstPage && isLastPage && (
            {'|'}
            )} */}

          {Array.from({ length: totalPages }, (_, index) => (
            <Link key={index} to={`/blog/${index === 0 ? '' : index + 1}`}>
              {index + 1}
            </Link>
          ))}

          {!isLastPage && (
            <Link to={nextPage} rel="next">
              Next Page
            </Link>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default BlogIndex

export const query = graphql`
  query($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      skip: $skip
      limit: $limit
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
      edges {
        node {
          id
          timeToRead
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMM Do, YYYY")
          }
          excerpt ######(format: HTML, pruneLength: 25)
        }
      }
    }
  }
`
