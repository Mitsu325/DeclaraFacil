import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexTitleSubtitle, ApexXAxis, NgApexchartsModule } from 'ng-apexcharts';
import { RequestsService } from '../../../shared/services/api/requests.service';
import { NgToastService } from 'ng-angular-popup';
import { TimeFormatPipe } from '../../../core/pipes/time-format.pipe';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface RequestOverview {
  totalRequests: number;
  pendingRequests: number;
  approvalRate: number;
  averageCompletionTime: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule,
    MatFormField,
    MatSelectModule,
    TimeFormatPipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  selectedMonthYear: string = '';
  monthYearOptions: string[] = [];
  overview: RequestOverview = {
    totalRequests: 0,
    pendingRequests: 0,
    approvalRate: 0,
    averageCompletionTime: 0,
  };
  barChartIsLoading = true;
  lineChartIsLoading = true;

  toast = inject(NgToastService);

  barChartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    plotOptions: ApexPlotOptions;
    xaxis: ApexXAxis;
    dataLabels: ApexDataLabels;
    title: ApexTitleSubtitle;
  } = {
      series: [],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      xaxis: {
        categories: [],
      },
      dataLabels: {
        enabled: true,
      },
      title: {
        text: '',
        align: 'left',
      },
    };

  lineChartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    dataLabels: ApexDataLabels;
    title: ApexTitleSubtitle;
  } = {
      series: [],
      chart: {
        type: 'line',
        height: 350,
      },
      xaxis: {
        categories: [],
      },
      dataLabels: {
        enabled: true,
      },
      title: {
        text: '',
        align: 'left',
      },
    };

  constructor(
    private requestsService: RequestsService
  ) { }

  ngOnInit(): void {

    const currentDate = new Date();
    const currentMonthYear = `${currentDate.toLocaleString('default', { month: '2-digit' })}/${currentDate.getFullYear()}`;
    this.selectedMonthYear = currentMonthYear;

    this.generateMonthYearOptions();

    this.loadOverview();

    this.loadRequestsByDeclaration();

    this.loadRequestsByDay();
  }

  generateMonthYearOptions() {
    const currentDate = new Date();
    const options: string[] = [];

    for (let i = 0; i < 6; i++) {
      const month = currentDate.toLocaleString('default', { month: '2-digit' });
      const year = currentDate.getFullYear();

      options.push(`${month}/${year}`);

      currentDate.setMonth(currentDate.getMonth() - 1);
    }

    this.monthYearOptions = options.reverse();
  }

  loadOverview() {
    const [month, year] = this.selectedMonthYear.split('/');

    this.requestsService.getRequestsOverview(month, year).subscribe({
      next: (data) => {
        this.overview = data;
      },
      error: () => {
        this.toast.danger(
          'Tente novamente',
          'Falha ao carregar os dados gerais de solicitações',
          5000
        );
      },
    });
  }

  loadRequestsByDeclaration() {
    const [month, year] = this.selectedMonthYear.split('/');

    this.barChartIsLoading = true;

    this.requestsService.getRequestsByDeclaration(month, year).subscribe({
      next: (data) => {
        this.barChartOptions = {
          series: [
            {
              name: 'Quantidade',
              data: data.map((item: any) => item.totalRequests),
            },
          ],
          chart: {
            type: 'bar',
            height: 350,
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          xaxis: {
            categories: data.map((item: any) => item.declarationType),
            labels: {
              style: {
                fontSize: '12px',
              },
            },
          },
          dataLabels: {
            enabled: true,
          },
          title: {
            text: '',
            align: 'left',
          },
        };

        this.barChartIsLoading = false;
      },
      error: () => {
        this.toast.danger(
          'Tente novamente',
          'Falha ao carregar os dados de solicitações por declaração',
          5000
        );

        this.barChartIsLoading = false;
      },
    });
  }

  loadRequestsByDay() {
    const [month, year] = this.selectedMonthYear.split('/');

    this.lineChartIsLoading = true;

    this.requestsService.getRequestsByDay(month, year).subscribe({
      next: (data) => {
        this.lineChartOptions = {
          series: [
            {
              name: 'Solicitações',
              data: data.map((item: any) => item?.totalRequests),
            },
          ],
          chart: {
            type: 'line',
            height: 350,
          },
          xaxis: {
            categories: data.map((item: any) => item?.date),
          },
          dataLabels: {
            enabled: true,
          },
          title: {
            text: '',
            align: 'left',
          },
        };

        this.lineChartIsLoading = false;
      },
      error: () => {
        this.toast.danger(
          'Tente novamente',
          'Falha ao carregar os dados de solicitações por dia',
          5000
        );

        this.lineChartIsLoading = false;
      },
    });
  }

  onMonthYearChange() {
    this.loadOverview();
    this.loadRequestsByDeclaration();
    this.loadRequestsByDay();
  }
}
