import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'menuCategory',
  title: 'Menu Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: {
        hotspot: true, // Enables hotspot for better image cropping
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          options: {
            isHighlighted: true, // Shows this field when image is selected
          },
        },
      ],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      order: 'order',
      media: 'image',
    },
    prepare(selection) {
      const { title, order, media } = selection
      return {
        title: title,
        subtitle: `Order: ${order}`,
        media: media,
      }
    },
  },
})