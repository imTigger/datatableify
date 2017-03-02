# datatableify
jQuery plugin enable you to use HTML5 data-* attributes to simpified [DataTables](https://datatables.net/DataTables) initialization and configuration

## Parameters
### &lt;table&gt; Level Mapping
- If `data-datatable-ajax-load-url` is set, it will be mapped to `dataTable.ajax.url`.
  `dataTable.ajax.processing` &amp; ``dataTable.ajax.serverSide` is set to `true` automagically.

- If `data-datatable-ajax-order-url` is set, `row-reorder.dt` event will be listened, creating ajax request to that url. 
  `dataTable.rowReorder` is set to true, `dataTable.paging` is set to `false`

### &lt;th&gt; Level Mapping
 - `data-datatable-id` is mapped to `columns.data`
 - `data-datatable-name` is mapped to `columns.name`
 - `data-datatable-searchable` is mapped to `columns.searchable`
 - `data-datatable-sortable` is mapped to `columns.sortable`
 - `data-datatable-class` is mapped to `columns.className`

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
