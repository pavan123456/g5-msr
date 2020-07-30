import items from './notes.json'

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
      metrics: [
        {
          chart: {}
        }
      ]
    }
  }
}
