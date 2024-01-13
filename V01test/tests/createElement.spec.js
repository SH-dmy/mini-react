import React from "../core/React";
import { it, expect, describe } from 'vitest'

describe('createElement', () => {
  if('should return vdom for element', () => {
    const el = React.createElement('div', null, 'myduu')

    expect(el).toEqual({
      type: 'div',
      props:{
        children: [{
          type: 'TEXT_ELEMENT',
          props: {
            nodeValue: 'myduu',
            children: []
          }
        }]
      }
    })
  })
})