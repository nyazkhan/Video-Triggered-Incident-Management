import { Directive, Input, ElementRef, EventEmitter, Output } from '@angular/core';
declare let google: any;

@Directive({
  selector: '[GoogleChart]'
})
export class GoogleChartDirective {

  @Input('chartType') chartType;
  @Input('dataTable') dataTable;
  @Input('options') options;

  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();

  constructor(public element: ElementRef) {
    google.charts.load('current');
    google.charts.setOnLoadCallback(() => {
      this.drawVisualization(this.chartType, this.dataTable, this.options, this.element.nativeElement.id);
    });
  }

  drawVisualization(chartType, dataTable, options, containerId) {
    var wrapper = new google.visualization.ChartWrapper({
      'chartType': chartType,
      'dataTable': dataTable,
      'options': options || {},
      'containerId': containerId
    });
    wrapper.draw();
    google.visualization.events.addListener(wrapper, 'ready', () => {
      google.visualization.events.addListener(wrapper.getChart(), 'select', () => {
        const selectedItem = wrapper.getChart().getSelection()[0];
        if (selectedItem) {
          let object;
          if (selectedItem !== undefined) {
            const selectedRowValues = [];
            if (selectedItem.row !== null) {
              selectedRowValues.push(wrapper.getDataTable().getValue(selectedItem.row, 0));
              selectedRowValues.push(wrapper.getDataTable().getValue(selectedItem.row, selectedItem.column));
              object = {
                message: 'select',
                row: selectedItem.row,
                column: selectedItem.column,
                selectedRowValues: selectedRowValues
              };
            }
          }
          this.onSelect.emit(object);
        } else {

        }
      });
      google.visualization.events.addListener(wrapper.getChart(), 'click', (e) => {
        console.log("click", e.targetID.split('#'));
        this.onClick.emit(e.targetID.split('#'));
      });
      google.visualization.events.addListener(wrapper.getChart(), 'onmouseover', (e) => {
        // console.log("onmouseover", e);
        this.element.nativeElement.style.cursor = 'pointer';
      });
      google.visualization.events.addListener(wrapper.getChart(), 'onmouseout', (e) => {
        // console.log("onmouseout", e);
        this.element.nativeElement.style.cursor = 'default';
      });
    });
  }

}
