import { defineField, defineType } from 'sanity'

const UNIT_TYPE_OPTIONS = [
  { title: 'L', value: 'L' },
  { title: 'mL', value: 'mL' },
  { title: 'kg', value: 'kg' },
  { title: 'g', value: 'g' },
  { title: 'lb', value: 'lb' },
  { title: 'each', value: 'each' },
  { title: 'cup', value: 'cup' },
  { title: 'box', value: 'box' },
  { title: 'bag', value: 'bag' },
  { title: 'bottle', value: 'bottle' },
  { title: 'can', value: 'can' },
  { title: 'container', value: 'container' },
  { title: 'tray', value: 'tray' },
  { title: 'case', value: 'case' },
  { title: 'jar', value: 'jar' },
  { title: 'pack', value: 'pack' },
  { title: 'pcs', value: 'pcs' },
  { title: 'portion', value: 'portion' },
]

export default defineType({
  name: 'wholesaleProduct',
  title: 'Wholesale Product',
  type: 'document',
  fields: [
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Immutable product code, e.g. IC-AKBAR-11L',
      validation: (Rule) => Rule.required(),
      readOnly: ({ document }) => Boolean(document?._createdAt),
    }),
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'e.g. FROZEN — ICE CREAM, DAIRY — MILK VARIETIES',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'unitType',
      title: 'Unit Type',
      type: 'string',
      options: {
        list: UNIT_TYPE_OPTIONS,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'unitValue',
      title: 'Unit Value',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'unitDisplayOverride',
      title: 'Unit Display Override',
      type: 'string',
      description: 'Optional custom label, e.g. ~4 kg',
    }),
    defineField({
      name: 'unitPrice',
      title: 'Unit Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'weight',
      title: 'Weight (Legacy)',
      type: 'string',
      description: 'Deprecated. Use unitType and unitValue instead.',
      hidden: true,
    }),
    defineField({
      name: 'price',
      title: 'Price (Legacy)',
      type: 'number',
      description: 'Deprecated. Use unitPrice instead.',
      hidden: true,
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      sku: 'sku',
      unitType: 'unitType',
      unitValue: 'unitValue',
      media: 'image',
    },
    prepare({ title, sku, unitType, unitValue }) {
      return {
        title: sku ? `${sku} — ${title}` : title,
        subtitle: unitType ? `${unitValue} ${unitType}` : undefined,
      }
    },
  },
})
