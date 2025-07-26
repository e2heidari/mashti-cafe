/* eslint-disable @typescript-eslint/no-explicit-any */
const newsItem = {
  name: 'newsItem',
  title: 'News Item',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required().max(60),
      description: 'News item title (max 60 characters)'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule: any) => Rule.required().max(200),
      description: 'News item description (max 200 characters)'
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: (Rule: any) => Rule.required(),
      description: 'News item image (recommended: 600x400px)'
    },
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      validation: (Rule: any) => Rule.required().max(20),
      description: 'Button text (max 20 characters)',
      initialValue: 'View Menu'
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1),
      description: 'Display order (1 = first, 2 = second, etc.)'
    },
    {
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Show this news item on the website'
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      order: 'order'
    },
    prepare(selection: any) {
      const {title, media, order} = selection
      return {
        title: `${order}. ${title}`,
        media: media
      }
    }
  }
}

export default newsItem 