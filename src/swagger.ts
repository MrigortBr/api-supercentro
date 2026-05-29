import { OpenAPIV3 } from "openapi-types";

export const swaggerSpec: OpenAPIV3.Document = {
    openapi: "3.0.0",
    info: {
        title: "API Supercentro",
        version: "1.1.1",
        description: "Documentação da API Supercentro",
    },
    servers: [{ url: "http://localhost:2000", description: "Desenvolvimento" }],
    components: {
        schemas: {
            Instituicion: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                    state: { type: "string" },
                    responsible: { type: "string" },
                    status: { type: "string" },
                    observations: { type: "string", nullable: true },
                },
            },
            InstituicionInput: {
                type: "object",
                required: ["name", "state", "responsible", "status"],
                properties: {
                    name: { type: "string" },
                    state: { type: "string" },
                    responsible: { type: "string" },
                    status: { type: "string" },
                    observations: { type: "string", nullable: true },
                },
            },
            Activity: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    id_instituicion: { type: "integer" },
                    name: { type: "string" },
                    responsible: { type: "integer", nullable: true },
                    start_date: { type: "string", format: "date-time", nullable: true },
                    end_date: { type: "string", format: "date-time", nullable: true },
                    status: {
                        type: "string",
                        enum: ["Projetado", "Em andamento", "Concluído"],
                    },
                },
            },
            ActivityInput: {
                type: "object",
                required: ["id_instituicion", "name", "status"],
                properties: {
                    id_instituicion: { type: "integer" },
                    name: { type: "string" },
                    responsible: { type: "integer", nullable: true },
                    start_date: { type: "string", format: "date-time", nullable: true },
                    end_date: { type: "string", format: "date-time", nullable: true },
                    status: {
                        type: "string",
                        enum: ["Projetado", "Em andamento", "Concluído"],
                    },
                },
            },
            Machine: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    id_instituicion: { type: "integer" },
                    simb: { type: "string" },
                    descricao: { type: "string" },
                    status: { type: "string" },
                    marca: { type: "string", nullable: true },
                    quantidade: { type: "integer" },
                    previsao_entrega: { type: "string", format: "date-time", nullable: true },
                    created_at: { type: "string", format: "date-time" },
                },
            },
            MachineInput: {
                type: "object",
                required: ["id_instituicion", "simb", "descricao", "status", "quantidade"],
                properties: {
                    id_instituicion: { type: "integer" },
                    simb: { type: "string" },
                    descricao: { type: "string" },
                    status: { type: "string" },
                    marca: { type: "string", nullable: true },
                    quantidade: { type: "integer" },
                    previsao_entrega: { type: "string", format: "date-time", nullable: true },
                },
            },
            Photo: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    id_instituicion: { type: "integer" },
                    url: { type: "string" },
                },
            },
            Error: {
                type: "object",
                properties: {
                    message: { type: "string" },
                },
            },
        },
    },
    paths: {
        "/instituicion": {
            get: {
                tags: ["Instituicion"],
                summary: "Listar todas as instituições",
                parameters: [
                    { name: "page", in: "query", schema: { type: "integer", default: 1 } },
                    { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
                ],
                responses: {
                    "200": {
                        description: "Lista de instituições",
                        content: {
                            "application/json": {
                                schema: { type: "array", items: { $ref: "#/components/schemas/Instituicion" } },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ["Instituicion"],
                summary: "Criar instituição",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/InstituicionInput" },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Instituição criada",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Instituicion" },
                            },
                        },
                    },
                },
            },
        },
        "/instituicion/{id}": {
            get: {
                tags: ["Instituicion"],
                summary: "Buscar instituição por ID",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } },
                ],
                responses: {
                    "200": {
                        description: "Instituição encontrada",
                        content: {
                            "application/json": { schema: { $ref: "#/components/schemas/Instituicion" } },
                        },
                    },
                    "404": { description: "Não encontrada", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
                },
            },
            put: {
                tags: ["Instituicion"],
                summary: "Atualizar instituição",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/InstituicionInput" } },
                    },
                },
                responses: {
                    "200": {
                        description: "Instituição atualizada",
                        content: { "application/json": { schema: { $ref: "#/components/schemas/Instituicion" } } },
                    },
                },
            },
            delete: {
                tags: ["Instituicion"],
                summary: "Deletar instituição",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } },
                ],
                responses: {
                    "204": { description: "Deletada com sucesso" },
                },
            },
        },
        "/activities": {
            get: {
                tags: ["Activities"],
                summary: "Listar todas as atividades",
                parameters: [
                    { name: "page", in: "query", schema: { type: "integer", default: 1 } },
                    { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
                ],
                responses: {
                    "200": {
                        description: "Lista de atividades",
                        content: {
                            "application/json": {
                                schema: { type: "array", items: { $ref: "#/components/schemas/Activity" } },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ["Activities"],
                summary: "Criar atividade",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/ActivityInput" } },
                    },
                },
                responses: {
                    "201": {
                        description: "Atividade criada",
                        content: { "application/json": { schema: { $ref: "#/components/schemas/Activity" } } },
                    },
                },
            },
        },
        "/activities/{id}": {
            get: {
                tags: ["Activities"],
                summary: "Buscar atividade por ID",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } },
                ],
                responses: {
                    "200": {
                        description: "Atividade encontrada",
                        content: { "application/json": { schema: { $ref: "#/components/schemas/Activity" } } },
                    },
                    "404": { description: "Não encontrada", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
                },
            },
            put: {
                tags: ["Activities"],
                summary: "Atualizar atividade",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/ActivityInput" } },
                    },
                },
                responses: {
                    "200": {
                        description: "Atividade atualizada",
                        content: { "application/json": { schema: { $ref: "#/components/schemas/Activity" } } },
                    },
                },
            },
            delete: {
                tags: ["Activities"],
                summary: "Deletar atividade",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } },
                ],
                responses: {
                    "204": { description: "Deletada com sucesso" },
                },
            },
        },
        "/machine/{id}": {
            get: {
                tags: ["Machine"],
                summary: "Listar equipamentos por ID da instituição",
                parameters: [
                    { name: "id", in: "path", required: true, description: "ID da instituição", schema: { type: "integer" } },
                ],
                responses: {
                    "200": {
                        description: "Lista de equipamentos",
                        content: {
                            "application/json": {
                                schema: { type: "array", items: { $ref: "#/components/schemas/Machine" } },
                            },
                        },
                    },
                    "404": { description: "Não encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
                },
            },
            post: {
                tags: ["Machine"],
                summary: "Criar equipamento para uma instituição",
                parameters: [
                    { name: "id", in: "path", required: true, description: "ID da instituição", schema: { type: "integer" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/MachineInput" } },
                    },
                },
                responses: {
                    "201": {
                        description: "Equipamento criado",
                        content: { "application/json": { schema: { $ref: "#/components/schemas/Machine" } } },
                    },
                },
            },
            put: {
                tags: ["Machine"],
                summary: "Atualizar equipamento",
                parameters: [
                    { name: "id", in: "path", required: true, description: "ID do equipamento", schema: { type: "integer" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/MachineInput" } },
                    },
                },
                responses: {
                    "200": {
                        description: "Equipamento atualizado",
                        content: { "application/json": { schema: { $ref: "#/components/schemas/Machine" } } },
                    },
                },
            },
            delete: {
                tags: ["Machine"],
                summary: "Deletar equipamento",
                parameters: [
                    { name: "id", in: "path", required: true, description: "ID do equipamento", schema: { type: "integer" } },
                ],
                responses: {
                    "200": {
                        description: "Equipamento removido",
                        content: { "application/json": { schema: { type: "object", properties: { message: { type: "string" } } } } },
                    },
                },
            },
        },
        "/photos/{id}": {
            get: {
                tags: ["Photos"],
                summary: "Listar fotos de uma instituição",
                parameters: [
                    { name: "id", in: "path", required: true, description: "ID da instituição", schema: { type: "integer" } },
                ],
                responses: {
                    "200": {
                        description: "Lista de fotos",
                        content: {
                            "application/json": {
                                schema: { type: "array", items: { $ref: "#/components/schemas/Photo" } },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ["Photos"],
                summary: "Upload de foto para uma instituição",
                parameters: [
                    { name: "id", in: "path", required: true, description: "ID da instituição", schema: { type: "integer" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: {
                                type: "object",
                                required: ["file"],
                                properties: {
                                    file: {
                                        type: "string",
                                        format: "binary",
                                        description: "Imagem (PNG, JPEG, JPG, WebP — máx. 5MB)",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "204": { description: "Upload realizado com sucesso" },
                    "400": { description: "Imagem obrigatória", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
                },
            },
            delete: {
                tags: ["Photos"],
                summary: "Deletar foto",
                parameters: [
                    { name: "id", in: "path", required: true, description: "ID da foto", schema: { type: "integer" } },
                ],
                responses: {
                    "204": { description: "Foto deletada com sucesso" },
                },
            },
        },
    },
};
