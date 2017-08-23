# datatableify
jQuery plugin enable you to use HTML5 data-* attributes to simplified [DataTables](https://datatables.net/DataTables) initialization and configuration.
It also generate additional header with various types of search fields.

**Deprecated and abondoned in favor of** [imTigger/DataTables-SearchHeader](https://github.com/imTigger/DataTables-SearchHeader)

## Parameters
### &lt;table&gt; Level Options
- If `data-datatable-ajax-load-url` is set, it will be mapped to `dataTable.ajax.url`.
  `dataTable.ajax.processing` &amp; ``dataTable.ajax.serverSide` is set to `true` automagically.

- If `data-datatable-ajax-order-url` is set, `row-reorder.dt` event will be listened
 Once triggered, creating ajax request to that url. 
`dataTable.rowReorder` is set to true, `dataTable.paging` is set to `false`

### &lt;th&gt; Level Options
 - `data-datatable-id` is mapped to `columns.data`
 - `data-datatable-name` is mapped to `columns.name`
 - `data-datatable-searchable` is mapped to `columns.searchable`
 - `data-datatable-sortable` is mapped to `columns.sortable`
 - `data-datatable-class` is mapped to `columns.className`
 - `datatable-search-type` can be `select|date|date-range|custom`,
 - * `select` requires `datatable-search-custom` and will generate &lt;select&gt; in header cell
 - * `date` generates one &lt;input&gt; with class `datepicker`
 - * `date-range` generates two &lt;input&gt; with class `datepicker datatable-filter` :exclamation:
 - *  `custom` requires `datatable-search-custom` and will place that HTML in header cell
 - `datatable-search-options` requires JSON string with format {key: value, key2: value2, ...}
 - `datatable-search-custom` requires HTML
 -  :exclamation: &lt;input&gt; with class datatable-filter will be submitted as additional GET parameter in each HTTP request.
  Server MUST handle it manually for them to take effect

## Example 1 (Server Side Table with Column Configuration)
```
<table class="table table-striped table-bordered table-hover" id="dataTables" data-datatable-ajax-load-url="http://domain.com/">
    <thead>
    <tr>
        <th data-datatable-id="id" data-datatable-name="order.id">ID</th>
        <th data-datatable-id="order_number" data-datatable-name="order.order_number">Order Number</th>
        <th data-datatable-id="parcel_value" data-datatable-name="parcel.value" data-datatable-searchable="false">Parcel Value</th>
        <th data-datatable-id="actions" data-datatable-searchable="false" data-datatable-sortable="false" data-datatable-class="dt-center">Actions</th>
    </tr>
    </thead>
    <tbody>
    </tbody>
</table>
```

Reference: https://datatables.net/reference/option/
