import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { wholesaleOrderPlugin } from './sanity/plugins/wholesaleOrder'

export default defineConfig({
  name: 'default',
  title: 'Mashti Cafe CMS',

  projectId: 'eh05fgze',
  dataset: 'mashti-menu',

  plugins: [deskTool(), visionTool(), wholesaleOrderPlugin()],

  schema: {
    types: schemaTypes,
  },
})