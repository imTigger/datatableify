(function( $ ) {
    $.fn.datatableify = function(options) {
        var $this = $(this);

        var dataTable;
        var dataTableOptions = $.extend({
            searching: true,
            responsive: true,

            // Shortcut variables
            ajaxLoadUrl: null,
            ajaxOrderUrl: null
        }, options);

        var cols = [];
        var firstColumn = 0;

        // Gather column information from thead
        $this.find('thead tr th').each(function (k, v) {
            if ($(v).data('datatable-ignore')) {
                cols.push({
                    data: 'selection',
                    searchable: false,
                    searchType: 'normal',
                    sortable: false,
                    className: $(v).data('datatable-class')
                });
                firstColumn += 1;
            } else {
                cols.push({
                    data: $(v).data('datatable-id'),
                    name: $(v).data('datatable-name'),
                    searchable: $(v).data('datatable-searchable'),
                    searchType: $(v).data('datatable-search-type'),
                    searchCustom: $(v).data('datatable-search-custom'),
                    searchOptions: $(v).data('datatable-search-options'),
                    sortable: $(v).data('datatable-sortable'),
                    className: $(v).data('datatable-class')
                });
            }
        });

        dataTableOptions.columns = cols;
        dataTableOptions.order = [[firstColumn, "desc"]];
        
        // Ajax server side table
        if ($(this).data('datatableAjaxLoadUrl')) {
            dataTableOptions.ajaxLoadUrl = $(this).data('datatableAjaxLoadUrl');
        }

        if (dataTableOptions.ajaxLoadUrl != null) {
            dataTableOptions.processing = true;
            dataTableOptions.serverSide = true;
            dataTableOptions.ajax = {
                url: dataTableOptions.ajaxLoadUrl,
                data: function (d) {
                    $('.datatable-filter').each(function (k, v) {
                        if (!$(v).is(':checkbox') || ($(v).is(':checkbox') && $(v).is(':checked'))) {
                            var name = $(v).prop('name');
                            var value = $(v).val();

                            d[name] = value;
                        }
                    });
                }
            };
        }

        // Disable paging for order table
        if (dataTableOptions.ajaxOrderUrl != null) {
            dataTableOptions.rowReorder = true;
            dataTableOptions.paging = false;
        }

        dataTable = $this.DataTable(dataTableOptions);

        // Build Search Header
        $this.find('thead').append('<tr class="thead-search"></tr>');
        $this.find('thead th').each(function (k, v) {
            if (cols[k]['searchable'] != false) {                    
                if (cols[k]['searchType'] == 'select' && typeof cols[k]['searchOptions'] == 'object' && Object.keys(cols[k]['searchOptions']).length > 0) {
                    $this.find('.thead-search').append('<td><select style="width: 100%" class="simple-search-field select_' + cols[k]['data'] + '"></select></td>');
                    $this.find('.select_' + cols[k]['data']).append('<option value=""></option>');

                    for (var i in cols[k]['searchOptions']) {
                        $this.find('.select_' + cols[k]['data']).append('<option value="' + i + '">' + cols[k]['searchOptions'][i] + '</option>');
                    }
                } else if (cols[k]['searchType'] == 'date-range') {
                    $this.find('.thead-search').append('<td><input type="text" placeholder="From" style="width: 50%" class="date-range-search-field datepicker datatable-filter" name="' + cols[k]['data'] + '_from"/><input type="text" placeholder="To" style="width: 50%" class="date-range-search-field datepicker datatable-filter" name="' + cols[k]['data'] + '_to"/></td>');
                } else if (cols[k]['searchType'] == 'date') {
                    $this.find('.thead-search').append('<td><input type="text" placeholder="" style="width: 100%" class="simple-search-field datepicker"/></td>');
                } else if (cols[k]['searchType'] == 'custom') {
                    $this.find('.thead-search').append('<td>' + $(cols[k]['searchCustom']).html() + '</td>');
                } else {
                    $this.find('.thead-search').append('<td><input type="text" placeholder="" style="width: 100%" class="simple-search-field"/></td>');
                }
            } else {
                $this.find('.thead-search').append('<td></td>');
            }
        });

        // Apply the search
        dataTable.columns().every(function () {
            var that = this;
            var search_header = $this.find('.thead-search td:nth-child(' + parseInt(this.index() + 1) + ')');

            $('input.simple-search-field, select.simple-search-field', search_header).on('keyup change', function () {
                that
                    .search(this.value)
                    .draw();
            });
        });

        // Responsive Table
        dataTable.on('responsive-resize', function (e, datatable, columns) {
            for (i in columns) {
                if (columns[i])
                    $this.find('.thead-search td:nth-child(' + i + ')').show();
                else
                    $this.find('.thead-search td:nth-child(' + i + ')').hide();
            }
        });

        // Row Reorder
        if ($(this).data('datatableAjaxOrderUrl')) {
            dataTableOptions.ajaxOrderUrl = $(this).data('datatableAjaxOrderUrl');
        }
        if (dataTableOptions.ajaxOrderUrl != null) {
            dataTable.on('row-reorder.dt', function (dragEvent, data, nodes) {
                var rowIndex0 = data[0].node._DT_RowIndex;
                var rowData0 = dataTable.row(rowIndex0).data();
                var rowIndex1 = data[1].node._DT_RowIndex;
                var rowData1 = dataTable.row(rowIndex1).data();

                $.ajax({
                    url: dataTableOptions.ajaxOrderUrl,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        from: rowData0.id,
                        to: rowData1.id
                    }
                });

            });

            $this.addClass('table-reorderable');
        }
        
        return dataTable;
    };
}(jQuery));