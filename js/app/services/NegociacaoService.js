class NegociacaoService {

    constructor() {

        this._http = new HttpService();
    }

    obterNegociacoesDaSemana() {

        return new Promise((resolve, reject) => {

            this._http
                .get('negociacoes/semana')
                .then(negociacoes => {
                    console.log(negociacoes);
                    resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)));
                })
                .catch(erro => {
                    console.log(erro);
                    reject('Não foi possível obter as negociações da semana');
                });
        });
    }

    obterNegociacoesDaSemanaAnterior() {

        return new Promise((resolve, reject) => {

            this._http
                .get('negociacoes/anterior')
                .then(negociacoes => {
                    console.log(negociacoes);
                    resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)));
                })
                .catch(erro => {
                    console.log(erro);
                    reject('Não foi possível obter as negociações da semana anterior');
                });
        });


    }

    obterNegociacoesDaSemanaRetrasada() {

        return new Promise((resolve, reject) => {

            this._http
                .get('negociacoes/retrasada')
                .then(negociacoes => {
                    console.log(negociacoes);
                    resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)));
                })
                .catch(erro => {
                    console.log(erro);
                    reject('Não foi possível obter as negociações da semana retrasada');
                });
        });
    }


    obterNegociacoes() {

        return new Promise((resolve, reject) => {

            Promise.all([
                this.obterNegociacoesDaSemana(),
                this.obterNegociacoesDaSemanaAnterior(),
                this.obterNegociacoesDaSemanaRetrasada()
            ]).then(periodos => {

                let negociacoes = periodos
                    .reduce((dados, periodo) => dados.concat(periodo), [])
                    .map(dado => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor ));

                resolve(negociacoes);

            }).catch(erro => reject(erro));
        });
    }

    cadastra(negociacao) {
        return ConnectionFactory
            .getConnection()
            .then(conn => new NegociacaoDao(conn))
            .then(dao => dao.adiciona(negociacao))
            .then(() => 'Negociacao adicionada com sucesso!')
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possivel adicionar a negociacao')
            });
    }

    lista() {
        return ConnectionFactory
            .getConnection()
            .then(conn => new NegociacaoDao(conn))
            .then(dao => dao.listaTodos())
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possivel obter as negociações!');
            });
    }

    apaga() {
        return ConnectionFactory
            .getConnection()
            .then(conn => new NegociacaoDao(conn))
            .then(dao => dao.listaTodos())
            .then(() => 'Negociacoes apagadas com sucesso!')
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possivel apagar as negociacao')
            });
    }

    importa(listaAtual) {
        return this.obterNegociacoes()
            .then(negociacoes =>
                negociacoes.filter(neg =>
                    !listaAtual.some(negExistente => JSON.stringify(neg) === JSON.stringify(negExistente))
                )
            )
            .catch(erro => {
                console.log(erro);
                throw new Erro('Não foi possivel buscar negociacoes para importar');
            });
    }
}
