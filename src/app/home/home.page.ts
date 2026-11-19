import { Component, OnInit } from '@angular/core';

export interface Tarefa {
  id: number;
  titulo: string;
  categoria: 'Trabalho' | 'Casa' | 'Saúde' | 'Estudos';
  prioridade: 'Alta' | 'Média' | 'Baixa';
  concluida: boolean;
  foco?: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  private readonly storageKey = 'minhas_tarefas_exemplo_v1';

  categorias: Array<'Todas' | 'Trabalho' | 'Casa' | 'Saúde' | 'Estudos'> = [
    'Todas',
    'Trabalho',
    'Casa',
    'Saúde',
    'Estudos',
  ];

  filtro: 'Todas' | 'Trabalho' | 'Casa' | 'Saúde' | 'Estudos' = 'Todas';

  tarefas: Tarefa[] = [
    {
      id: 101,
      titulo: 'Enviar relatório semanal para a equipa',
      categoria: 'Trabalho',
      prioridade: 'Alta',
      concluida: false,
      foco: true,
    },
    {
      id: 102,
      titulo: 'Organizar atendimento e orçamentos',
      categoria: 'Trabalho',
      prioridade: 'Média',
      concluida: false,
    },
    {
      id: 201,
      titulo: 'Pagar conta de água e luz',
      categoria: 'Casa',
      prioridade: 'Alta',
      concluida: false,
      foco: true,
    },
    {
      id: 202,
      titulo: 'Fazer compras da semana e arrumar a casa',
      categoria: 'Casa',
      prioridade: 'Média',
      concluida: false,
    },
    {
      id: 301,
      titulo: 'Beber 2 litros de água ao longo do dia',
      categoria: 'Saúde',
      prioridade: 'Alta',
      concluida: false,
      foco: true,
    },
    {
      id: 302,
      titulo: 'Caminhada leve de 30 minutos ao fim da tarde',
      categoria: 'Saúde',
      prioridade: 'Baixa',
      concluida: false,
    },
    {
      id: 401,
      titulo: 'Praticar componentes e rotas no Ionic / Angular',
      categoria: 'Estudos',
      prioridade: 'Alta',
      concluida: false,
      foco: true,
    },
    {
      id: 402,
      titulo: 'Rever exercícios e anotações das aulas',
      categoria: 'Estudos',
      prioridade: 'Média',
      concluida: false,
    },
  ];

  ngOnInit(): void {
    this.carregarTarefas();
  }

  get concluidas(): number {
    return this.tarefas.filter((t) => t.concluida).length;
  }

  get progresso(): number {
    if (this.tarefas.length === 0) {
      return 0;
    }
    return Math.round((this.concluidas / this.tarefas.length) * 100);
  }

  get tarefasFoco(): Tarefa[] {
    return this.tarefas.filter((t) => t.foco);
  }

  get tarefasFiltradas(): Tarefa[] {
    if (this.filtro === 'Todas') {
      return this.tarefas;
    }
    return this.tarefas.filter((t) => t.categoria === this.filtro);
  }

  filtrar(categoria: 'Todas' | 'Trabalho' | 'Casa' | 'Saúde' | 'Estudos'): void {
    this.filtro = categoria;
  }

  alternar(tarefa: Tarefa): void {
    tarefa.concluida = !tarefa.concluida;
    this.salvarTarefas();
  }

  corPrioridade(prioridade: string): string {
    switch (prioridade) {
      case 'Alta':
        return 'danger';
      case 'Média':
        return 'warning';
      case 'Baixa':
        return 'success';
      default:
        return 'medium';
    }
  }

  remover(id: number): void {
    this.tarefas = this.tarefas.filter((t) => t.id !== id);
    this.salvarTarefas();
  }

  restaurarExemplos(): void {
    localStorage.removeItem(this.storageKey);
    window.location.reload();
  }

  abrirCadastro(): void {
    const titulo = window.prompt('Título da nova tarefa:');
    if (!titulo || !titulo.trim()) {
      return;
    }

    const categoriaPadrao: 'Trabalho' | 'Casa' | 'Saúde' | 'Estudos' =
      this.filtro !== 'Todas' ? this.filtro : 'Estudos';

    const categoriaInput = window.prompt(
      'Categoria (Trabalho, Casa, Saúde ou Estudos):',
      categoriaPadrao
    );

    const prioridadeInput = window.prompt(
      'Prioridade (Alta, Média ou Baixa):',
      'Média'
    );

    let categoriaFinal: 'Trabalho' | 'Casa' | 'Saúde' | 'Estudos' = categoriaPadrao;
    const catLimpa = (categoriaInput || '').trim();
    if (
      catLimpa === 'Trabalho' ||
      catLimpa === 'Casa' ||
      catLimpa === 'Saúde' ||
      catLimpa === 'Estudos'
    ) {
      categoriaFinal = catLimpa;
    }

    let prioridadeFinal: 'Alta' | 'Média' | 'Baixa' = 'Média';
    const prioLimpa = (prioridadeInput || '').trim();
    if (prioLimpa === 'Alta' || prioLimpa === 'Média' || prioLimpa === 'Baixa') {
      prioridadeFinal = prioLimpa;
    }

    const novaTarefa: Tarefa = {
      id: Date.now(),
      titulo: titulo.trim(),
      categoria: categoriaFinal,
      prioridade: prioridadeFinal,
      concluida: false,
    };

    this.tarefas = [novaTarefa, ...this.tarefas];
    this.filtro = categoriaFinal;
    this.salvarTarefas();
  }

  private salvarTarefas(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.tarefas));
    } catch {
      // Ignora erro de armazenamento
    }
  }

  private carregarTarefas(): void {
    try {
      const salvo = localStorage.getItem(this.storageKey);
      if (salvo) {
        const parsed: unknown = JSON.parse(salvo);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.tarefas = parsed as Tarefa[];
        }
      }
    } catch {
      // Mantém exemplos iniciais
    }
  }
}