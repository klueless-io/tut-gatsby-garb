import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'

import Layout from '../components/layout'

const ProductTemplate = ({
  data: { contentfulProduct: product },
  location,
}) => (
  <Layout>
    <div
      style={{
        marginLeft: '0 auto',
        width: '100%',
        textAlign: 'center',
      }}
    >
      <h2>{product.name}</h2>
      <h2>{product.slug}er</h2>
      <h3>${product.price}</h3>
      <button
        style={{
          background: 'darkorange',
          color: 'white',
          padding: '0.3em',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        className="snipcart-add-item"
        data-item-id={product.slug}
        data-item-price={product.price}
        data-item-image={product.image.file.url}
        data-item-name={product.name}
        data-item-url={location.pathname}
      >
        Add to Cart
      </button>
      <p></p>
      <p>{product.description}</p>
      <Img
        style={{ margin: '0 auto', maxWidth: '600px' }}
        fluid={product.image.fluid}
      />
      <span style={{ color: '#ccc' }}>Added on {product.createdAt}</span>
    </div>
  </Layout>
)

export const query = graphql`
  query($slug: String!) {
    contentfulProduct(slug: { eq: $slug }) {
      name
      price
      slug
      description
      createdAt(formatString: "MMMM Do YYYY")
      image {
        fluid(maxWidth: 800) {
          ...GatsbyContentfulFluid
        }
        file {
          url
        }
      }
    }
  }
`

export default ProductTemplate
