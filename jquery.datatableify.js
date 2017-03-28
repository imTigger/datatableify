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

        if (typeof dataTableOptions.order == 'undefined') {
            dataTableOptions.order = [[firstColumn, "desc"]];
        }
        dataTableOptions.columns = cols;
        
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
                var fieldName = cols[k]['data'];
                fieldName = fieldName.replace('.', '_');

                if (cols[k]['searchType'] == 'select' && typeof cols[k]['searchOptions'] == 'object' && Object.keys(cols[k]['searchOptions']).length > 0) {
                    $this.find('.thead-search').append('<td><select class="simple-search-field select_' + fieldName + '"></select></td>');
                    $this.find('.select_' + fieldName).append('<option value=""></option>');

                    for (var i in cols[k]['searchOptions']) {
                        $this.find('.select_' + fieldName).append('<option value="' + cols[k]['searchOptions'][i].key + '">' + cols[k]['searchOptions'][i].value + '</option>');
                    }
                } else if (cols[k]['searchType'] == 'date-range') {
                    $this.find('.thead-search').append('<td><input type="text" placeholder="From" class="date-range-search-field datepicker datatable-filter" name="' + fieldName + '_from"/><input type="text" placeholder="To" class="date-range-search-field datepicker datatable-filter" name="' + fieldName + '_to"/></td>');
                } else if (cols[k]['searchType'] == 'date') {
                    $this.find('.thead-search').append('<td><input type="text" placeholder="" class="simple-search-field datepicker"/></td>');
                } else if (cols[k]['searchType'] == 'custom') {
                    $this.find('.thead-search').append('<td>' + $(cols[k]['searchCustom']).html() + '</td>');
                } else {
                    $this.find('.thead-search').append('<td><input type="text" placeholder="" class="simple-search-field"/></td>');
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
            dataTable.on('row-reorder.dt', function (dragEvent, diff, edit) {
                var origin = edit.triggerRow.data();

                if (diff.length == 0) return;

                var rowIndexFirst = diff[0].node._DT_RowIndex;
                var rowDataFirst = dataTable.row(rowIndexFirst).data();

                var rowIndexSecond = diff[1].node._DT_RowIndex;
                var rowDataSecond = dataTable.row(rowIndexSecond).data();

                var rowIndexSecondLast = diff[diff.length - 2].node._DT_RowIndex;
                var rowDataSecondLast = dataTable.row(rowIndexSecondLast).data();

                var rowIndexLast = diff[diff.length - 1].node._DT_RowIndex;
                var rowDataLast = dataTable.row(rowIndexLast).data();

                $.ajax({
                    url: dataTableOptions.ajaxOrderUrl,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        id: origin.id,
                        before: origin.id == rowDataFirst.id ? rowDataSecond.id : null,
                        after: origin.id == rowDataLast.id ? rowDataSecondLast.id : null
                    }
                });
            });

            $this.addClass('table-reorderable');
        }
        
        return dataTable;
    };
}(jQuery));