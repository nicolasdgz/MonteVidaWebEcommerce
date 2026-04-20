import { type SchemaTypeDefinition } from 'sanity'
import { productType } from './product'
import { categoryType } from './category'
import blockContent from './blockContent'
import post from './post'
import author from './author'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [productType, categoryType, blockContent, post, author],
}
