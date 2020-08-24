import items from './notes.json'
import { groups, promoted } from './promoted-notes.json'
const fields = [
  {
    key: 'selected',
    label: 'Selected',
    sortable: false,
    class: 'align-middle text-center'
  },
  {
    key: 'createdAt',
    label: 'Created',
    sortable: true,
    class: 'align-middle text-center'
  },
  {
    key: 'updatedAt',
    label: 'Updated',
    sortable: true,
    class: 'align-middle text-center'
  },
  {
    key: 'internal',
    label: 'Visibility',
    sortable: true,
    class: 'align-middle text-center'
  },
  {
    key: 'annotationCategory',
    label: 'Category',
    sortable: true,
    class: 'align-middle text-center'
  },
  {
    key: 'annotationType',
    label: 'Action Type',
    sortable: true,
    class: 'align-middle text-center tbl-w200'
  },
  {
    key: 'annotationUser',
    label: 'User',
    sortable: true,
    class: 'align-middle text-center tbl-w200'
  },
  {
    key: 'salesforceSync',
    label: 'SF Synced',
    sortable: true,
    class: 'align-middle text-center'
  },
  {
    key: 'note',
    label: 'Note',
    sortable: true,
    class: 'align-middle tbl-w350'
  },
  {
    key: 'clientName',
    label: 'Client',
    sortable: true,
    class: 'align-middle tbl-w350 text-center'
  },
  {
    key: 'locationNames',
    label: 'Location Name(s)',
    sortable: true,
    class: 'align-middle tbl-w400'
  }
]

export const table = {
  data() {
    return {
      table: {
        id: 'testTable',
        fields,
        items,
        totalRows: items.length
      }
    }
  }
}

export const timelineChartData = {
  data() {
    return {
      series: [{
        name: 'test-team',
        data: []
      }]
    }
  }
}

export const metricsData = {
  data() {
    return {
      chart: {
        id: 'metrics',
        categories: ['Digital Advertising', 'SEO', 'Customer Care'],
        series: [
          {
            name: 'Cases Solved',
            data: [2, 1, 56]
          },
          {
            name: 'Account Changes',
            data: [2, 6, 1]
          },
          {
            name: 'Customer Contact',
            data: [3, 0, 0]
          },
          {
            name: 'General Note',
            data: [15, 12, 0]
          },
          {
            name: 'Optimizations',
            data: [683, 138, 0]
          }
        ]
      }
    }
  }
}

export const promotedNotes = {
  data() {
    return {
      groups,
      promoted
    }
  }
}

export const sharedViewData = {
  client: {
    name: '',
    urn: ''
  },
  runDate: '',
  from: '',
  to: '',
  overview: [
    {
      name: 'Digital Advertising',
      data: [
        { x: 'Cases Solved', y: 2 },
        { x: 'Account Audit', y: 6 },
        { x: 'Account Changes', y: 2 },
        { x: 'Customer Contact', y: 3 },
        { x: 'General Note', y: 15 },
        { x: 'Optimizations', y: 683 }
      ]
    },
    {
      name: 'SEO',
      data: [
        { x: 'Cases Solved', y: 1 },
        { x: 'Account Audit', y: 6 },
        { x: 'Account Changes', y: 6 },
        { x: 'Customer Contact', y: 0 },
        { x: 'General Note', y: 12 },
        { x: 'Optimizations', y: 138 }
      ]
    },
    {
      name: 'Customer Care',
      data: [
        { x: 'Cases Solved', y: 56 },
        { x: 'Account Audit', y: 6 },
        { x: 'Account Changes', y: 1 },
        { x: 'Customer Contact', y: 0 },
        { x: 'General Note', y: 0 },
        { x: 'Optimizations', y: 0 }
      ]
    }
  ],
  teams: [
    {
      name: 'Digital Advertising',
      overview: [
        {
          id: 'optimizations',
          category: 'Optimizations',
          series: [
            { name: 'Added Negative Keywords', data: [12] },
            { name: 'Updated Audiences', data: [1] },
            { name: 'Added Keywords', data: [21] },
            { name: 'Changed Location Strategy', data: [2] },
            { name: 'Paused Campaign', data: [1] },
            { name: 'Enabled Campaign', data: [5] },
            { name: 'Refreshed Ad Copy', data: [2] },
            { name: 'Testing', data: [8] },
            { name: 'T&O Added', data: [12] },
            { name: 'Manual Spend Adjustments', data: [8] },
            { name: 'Manual Bid Adjustments', data: [3] }
          ]
        },
        {
          id: 'account-changes',
          category: 'Account Changes',
          series: [
            { name: 'Smart Bidding Strategy Change', data: [3] },
            { name: 'Specials/Promotions', data: [10] },
            { name: 'Spend Optimizer Version Change', data: [7] },
            { name: 'URL Change', data: [1] },
            { name: 'Whitelisting Events Change', data: [0] }
          ]
        }
      ],
      timeline: [
        {
          id: 'optimizations',
          name: 'Optimizations',
          data: [
            [
              'timestamp',
              1,
              10, // count of locations
              'html',
              'annotationType',
              false, // internal
              '' // csv of location names or count of locations if > 3
            ]
          ]
        }
      ],
      promoted: [
        {
          groupName: '',
          notes: [
            {
              title: '',
              content: '',
              locations: [].join(', ')
            }
          ]
        }
      ],
      contributor: {
        name: '',
        src: '',
        title: ''
      }
    }
  ]
}
