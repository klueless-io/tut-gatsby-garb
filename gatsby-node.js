const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

const PostTemplate = path.resolve('./src/templates/post-template.js')
const BlogTemplate = path.resolve('./src/templates/blog-template.js')
const ProductTemplate = path.resolve('./src/templates/product-template.js')

// When GraphQL nodes are being created, inject the slug based on the file name
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode, basePath: 'posts' })

    createNodeField({
      node,
      name: 'slug',
      value: slug,
    })
  }
}

// Get data for pages to create
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            fields {
              slug
            }
            excerpt
          }
        }
      }
      allContentfulProduct {
        totalCount
        edges {
          node {
            name
            price
            description
            slug
            private
            image {
              fluid {
                src
              }
            }
          }
        }
      }
    }
  `)

  // Create a page for every post
  const posts = result.data.allMarkdownRemark.edges

  posts.forEach(({ node: post }) => {
    createPage({
      path: `posts${post.fields.slug}`,
      component: PostTemplate,
      context: {
        slug: post.fields.slug,
      },
    })
  })

  const postsPerPage = 2
  const totalPages = Math.ceil(posts.length / postsPerPage)

  // Create a pagination pages
  Array.from({ length: totalPages }).forEach((_, index) => {
    const currentPage = index + 1
    const isFirstPage = index === 0
    const isLastPage = currentPage === totalPages

    createPage({
      path: isFirstPage ? 'blog' : `blog/${currentPage}`,
      component: BlogTemplate,
      context: {
        limit: postsPerPage,
        skip: index * postsPerPage,
        currentPage,
        isFirstPage,
        isLastPage,
        totalPages,
      },
    })
  })

  // Create a page for every post
  const products = result.data.allContentfulProduct.edges

  products.forEach(({ node: product }) => {
    createPage({
      path: `/products/${product.slug}`,
      component: ProductTemplate,
      context: {
        slug: product.slug,
      },
    })
  })
}
