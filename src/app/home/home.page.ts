
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

interface Tarefa {
  id: number;
  titulo: string;
  categoria: string;
  prioridade: string;
  concluida: boolean;
  foco: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {

  categorias = ['Todas', 'Trabalho', 'Casa', 'Saúde', 'Estudos'];

  filtro = 'Todas';

  tarefas: Tarefa[] = [
    {
      id: 1,
      titulo: 'Revisar e-mails',
      categoria: 'Trabalho',
      prioridade: 'Alta',
      concluida: false,
      foco: true
    },
    {
      id: 2,
      titulo: 'Pagar contas',
      categoria: 'Casa',
      prioridade: 'Média',
      concluida: false,
      foco: false
    },
    {
      id: 3,
      titulo: 'Treino 45 minutos',
      categoria: 'Saúde',
      prioridade: 'Alta',
      concluida: false,
      foco: true
    },
    {
      id: 4,
      titulo: 'Ler 15 páginas',
      categoria: 'Estudos',
      prioridade: 'Baixa',
      concluida: false,
      foco: true
    }
  ];

  constructor(private alertController: AlertController) {
    this.carregarTarefas();
  }

  get concluidas(): number {
    return this.tarefas.filter(t => t.concluida).length;
  }

  get progresso(): number {
    if (this.tarefas.length === 0) return 0;

    return Math.round(
      (this.concluidas / this.tarefas.length) * 100
    );
  }

  get tarefasFoco(): Tarefa[] {
    return this.tarefas.filter(t => t.foco).slice(0, 3);
  }

  get tarefasFiltradas(): Tarefa[] {
    if (this.filtro === 'Todas') {
      return this.tarefas;
    }

    return this.tarefas.filter(
      t => t.categoria === this.filtro
    );
  }

  filtrar(categoria: string) {
    this.filtro = categoria;
  }

  alternar(tarefa: Tarefa) {
    tarefa.concluida = !tarefa.concluida;
    this.salvarTarefas();
  }

  corPrioridade(prioridade: string): string {
    switch (prioridade) {
      case 'Alta': return 'danger';
      case 'Média': return 'warning';
      default: return 'success';
    }
  }

  async abrirCadastro() {
    const alert = await this.alertController.create({
      header: 'Nova tarefa',
      inputs: [
        {
          name: 'titulo',
          type: 'text',
          placeholder: 'Nome da tarefa'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Continuar',
          handler: (dados) => {
            if (!dados.titulo?.trim()) return false;

            this.selecionarDetalhes(dados.titulo.trim());
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async selecionarDetalhes(titulo: string) {
    const alert = await this.alertController.create({
      header: 'Detalhes da tarefa',
      inputs: [
        {
          name: 'categoria',
          type: 'radio',
          label: 'Trabalho',
          value: 'Trabalho',
          checked: true
        },
        {
          name: 'categoria',
          type: 'radio',
          label: 'Casa',
          value: 'Casa'
        },
        {
          name: 'categoria',
          type: 'radio',
          label: 'Saúde',
          value: 'Saúde'
        },
        {
          name: 'categoria',
          type: 'radio',
          label: 'Estudos',
          value: 'Estudos'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Próximo',
          handler: (categoria) => {
            this.selecionarPrioridade(titulo, categoria);
          }
        }
      ]
    });

    await alert.present();
  }

  async selecionarPrioridade(
    titulo: string,
    categoria: string
  ) {
    const alert = await this.alertController.create({
      header: 'Prioridade',
      inputs: [
        {
          name: 'prioridade',
          type: 'radio',
          label: 'Alta',
          value: 'Alta'
        },
        {
          name: 'prioridade',
          type: 'radio',
          label: 'Média',
          value: 'Média',
          checked: true
        },
        {
          name: 'prioridade',
          type: 'radio',
          label: 'Baixa',
          value: 'Baixa'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: (prioridade) => {
            this.adicionarTarefa(
              titulo,
              categoria,
              prioridade
            );
          }
        }
      ]
    });

    await alert.present();
  }

  adicionarTarefa(
    titulo: string,
    categoria: string,
    prioridade: string
  ) {
    const tarefa: Tarefa = {
      id: Date.now(),
      titulo,
      categoria,
      prioridade,
      concluida: false,
      foco: false
    };

    this.tarefas.unshift(tarefa);
    this.salvarTarefas();
  }

  remover(id: number) {
    this.tarefas = this.tarefas.filter(t => t.id !== id);
    this.salvarTarefas();
  }

  salvarTarefas() {
    localStorage.setItem(
      'minhas-tarefas',
      JSON.stringify(this.tarefas)
    );
  }

  carregarTarefas() {
    const dados = localStorage.getItem('minhas-tarefas');

    if (dados) {
      try {
        this.tarefas = JSON.parse(dados);
      } catch {
        console.error('Não foi possível carregar as tarefas.');
      }
    } else {
      this.salvarTarefas();
    }
  }
}
