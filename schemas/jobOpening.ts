import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'jobOpening',
  title: 'Job Opening',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Job Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      options: {
        list: [
          { title: 'Central', value: 'Central' },
          { title: 'Coquitlam', value: 'Coquitlam' },
          { title: 'Either', value: 'Either' },
        ],
        layout: 'radio'
      },
      initialValue: 'Either'
    }),
    defineField({
      name: 'type',
      title: 'Employment Type',
      type: 'string',
      options: {
        list: [
          { title: 'Full-time', value: 'Full-time' },
          { title: 'Part-time', value: 'Part-time' },
          { title: 'Contract', value: 'Contract' },
          { title: 'Seasonal', value: 'Seasonal' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'requirements',
      title: 'Requirements (one per line)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'postedAt',
      title: 'Posted At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'title', location: 'location', type: 'type', active: 'active' },
    prepare({ title, location, type, active }) {
      const suffix = active ? '' : ' (Inactive)'
      return {
        title: `${title}${suffix}`,
        subtitle: `${location || ''}${type ? ' • ' + type : ''}`,
      }
    }
  }
})


