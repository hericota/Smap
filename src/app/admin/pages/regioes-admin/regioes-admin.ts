import { Component } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

interface RegiaoIndicador {
  nome: string;
  total: number;
  altaPrioridade: number;
  emAndamento: number;
  resolvidas: number;
  tempoMedioDias: number;
}

interface KpiCard {
  titulo: string;
  valor: string;
  detalhe: string;
  cor: 'teal' | 'laranja' | 'vermelho' | 'verde';
}

@Component({
  selector: 'app-regioes-admin',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './regioes-admin.html',
  styleUrl: './regioes-admin.css',
})
export class RegioesAdmin {
  protected readonly kpis: KpiCard[] = [
    {
      titulo: 'Total de Regiões',
      valor: '8 bairros',
      detalhe: '100% da área urbana mapeada',
      cor: 'teal',
    },
    {
      titulo: 'Zona Mais Crítica',
      valor: 'Centro Histórico',
      detalhe: 'Alta densidade de queixas',
      cor: 'laranja',
    },
    {
      titulo: 'Tempo de Resolução',
      valor: '3.4 dias',
      detalhe: '-0.8 dias que o mês passado',
      cor: 'teal',
    },
    {
      titulo: 'Índice de Satisfação',
      valor: '92%',
      detalhe: 'Feedback positivo dos cidadãos',
      cor: 'verde',
    },
  ];

  protected readonly regioes: RegiaoIndicador[] = [
    { nome: 'Centro Histórico', total: 423, altaPrioridade: 14, emAndamento: 22, resolvidas: 156, tempoMedioDias: 2.4 },
    { nome: 'Vila Nova',        total: 289, altaPrioridade: 5,  emAndamento: 18, resolvidas: 92,  tempoMedioDias: 4.1 },
    { nome: 'Itoupava Norte',   total: 212, altaPrioridade: 2,  emAndamento: 14, resolvidas: 64,  tempoMedioDias: 3.2 },
    { nome: 'Escola Agrícola',  total: 178, altaPrioridade: 1,  emAndamento: 12, resolvidas: 58,  tempoMedioDias: 5.0 },
    { nome: 'Garcia',           total: 145, altaPrioridade: 1,  emAndamento: 9,  resolvidas: 42,  tempoMedioDias: 4.5 },
    { nome: 'Velha',            total: 112, altaPrioridade: 0,  emAndamento: 6,  resolvidas: 38,  tempoMedioDias: 3.8 },
    { nome: 'Ponta Aguda',      total: 98,  altaPrioridade: 2,  emAndamento: 4,  resolvidas: 32,  tempoMedioDias: 2.9 },
    { nome: 'Salto',            total: 76,  altaPrioridade: 0,  emAndamento: 3,  resolvidas: 22,  tempoMedioDias: 4.2 },
  ];

  protected readonly lineChartOptions: EChartsOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#9ca3af', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f0f2f1' } },
      axisLabel: { color: '#9ca3af', fontSize: 10 },
    },
    series: [
      {
        name: 'Tempo Médio (dias)',
        type: 'line',
        data: [6, 5.2, 4.8, 4.2],
        smooth: true,
        lineStyle: { color: '#13c4a3', width: 3 },
        itemStyle: { color: '#13c4a3' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(19, 196, 163, 0.2)' },
              { offset: 1, color: 'rgba(19, 196, 163, 0)' },
            ],
          },
        },
      },
    ],
  };

  protected readonly donutChartOptions: EChartsOption = {
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      textStyle: { color: '#68736d', fontSize: 11 },
      icon: 'circle',
    },
    series: [
      {
        name: 'Casos',
        type: 'pie',
        radius: ['55%', '75%'],
        avoidLabelOverlap: false,
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 18, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: [
          { value: 72, name: 'Resolvidos', itemStyle: { color: '#f59e0b' } },
          { value: 28, name: 'Em andamento', itemStyle: { color: '#13c4a3' } },
        ],
      },
    ],
  };

  protected readonly barChartOptions: EChartsOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#9ca3af', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f0f2f1' } },
      axisLabel: { color: '#9ca3af', fontSize: 10 },
    },
    series: [
      {
        name: 'Chamados',
        type: 'bar',
        data: [120, 180, 210, 260, 340, 420],
        itemStyle: {
          color: '#13c4a3',
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '50%',
      },
    ],
  };

  protected filtrarRegioes(): void {
    console.log('Filtrar regiões');
  }
}