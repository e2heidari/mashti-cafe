import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Mashti Cafe',

  projectId: 'eh05fgze',
  dataset: 'mashti-menu',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})