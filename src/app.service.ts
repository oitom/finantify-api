import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiInfo(): any {
    return {
      name: 'Finantify API',
      description:
        'Uma API para controlar e gerenciar gastos financeiros pessoais.',
      features: [
        'Cadastro de Despesas',
        'Visão Geral do Orçamento',
        'Categorização de Despesas',
        'Histórico de Transações',
        'Gráficos e Relatórios',
        'Metas Financeiras',
        'Lembretes e Notificações',
        'Sincronização em Nuvem',
        'Autenticação Segura',
        'Exportação de Dados',
        'Conselhos Financeiros',
      ],
      routes: [
        {
          endpoint: '/api/users',
          description: 'Endpoint para acessar os usuários.',
          method: 'GET',
        },
        {
          endpoint: '/api/users',
          description: 'Endpoint para criar um usuário.',
          method: 'POST',
        },
        {
          endpoint: '/api/users/:id',
          description: 'Endpoint para obter um usuário.',
          method: 'GET',
        },
        {
          endpoint: '/api/users/:id',
          description: 'Endpoint para atualizar um usuário.',
          method: 'PUT',
        },
        {
          endpoint: '/api/users/:id',
          description: 'Endpoint para deletar um usuário.',
          method: 'DELETE',
        },
        {
          endpoint: '/api/expenses',
          description: 'Endpoint para acessar as despesas.',
          method: 'GET',
        },
        {
          endpoint: '/api/expenses',
          description: 'Endpoint para criar uma despesa.',
          method: 'POST',
        },
        {
          endpoint: '/api/expenses/:id',
          description: 'Endpoint para obter uma despesa.',
          method: 'GET',
        },
        {
          endpoint: '/api/expenses/:id',
          description: 'Endpoint para atualizar uma despesa.',
          method: 'PUT',
        },
        {
          endpoint: '/api/expenses/:id',
          description: 'Endpoint para deletar uma despesa.',
          method: 'DELETE',
        },
        {
          endpoint: '/api/categories',
          description: 'Endpoint para acessar as categorias.',
          method: 'GET',
        },
        {
          endpoint: '/api/categories',
          description: 'Endpoint para criar uma categoria.',
          method: 'POST',
        },
        {
          endpoint: '/api/categories/:id',
          description: 'Endpoint para obter uma categoria.',
          method: 'GET',
        },
        {
          endpoint: '/api/categories/:id',
          description: 'Endpoint para atualizar uma categoria.',
          method: 'PUT',
        },
        {
          endpoint: '/api/categories/:id',
          description: 'Endpoint para deletar uma categoria.',
          method: 'DELETE',
        },
        {
          endpoint: '/api/transactions',
          description: 'Endpoint para acessar as transações.',
          method: 'GET',
        },
        {
          endpoint: '/api/transactions',
          description: 'Endpoint para criar uma transação.',
          method: 'POST',
        },
        {
          endpoint: '/api/transactions/:id',
          description: 'Endpoint para obter uma transação.',
          method: 'GET',
        },
      ],
    };
  }
}
