# datatableify
jQuery plugin enable you to use HTML5 data-* attributes to simpified [DataTables](https://datatables.net/DataTables) initialization and configuration

## Parameters
### <table> Level
- `data-datatable-ajax-load-url` => `dt.processing` = true, `dt.serverSide` = true, `dataTableOptions.ajax` = ajaxLoadUrl
- `data-datatable-ajax-order-url`
- 
### <th> Level
 - `data-datatable-id` => `columns.data`
 - `data-datatable-name` => `columns.name`
 - `data-datatable-searchable` => `columns.searchable`
 - `data-datatable-sortable` => `columns.sortable`
 - `data-datatable-class` => `columns.className`

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