import {utils} from 'umi';
import {
    Program,
    ImportDeclaration,
    CallExpression,
    MemberExpression,
    ExportDefaultDeclaration,
    ImportSpecifier,
    ImportDefaultSpecifier,
    ImportNamespaceSpecifier,
} from '@babel/types';

const {t, traverse} = utils;

export default function isValidModel({content}: { content: string }) {
    const {parser} = utils;
    const ast = parser.parse(content, {
        sourceType: 'module',
        plugins: [
            'typescript',
            'classProperties',
            'dynamicImport',
            'exportDefaultFrom',
            'exportNamespaceFrom',
            'functionBind',
            'nullishCoalescingOperator',
            'objectRestSpread',
            'optionalChaining',
            'decorators-legacy',
        ],
    });

    let typesHasImported = false;
    // let modelHasDefined = false;
    let modelInstanceHasExported = false;
    const visitor: utils.traverse.Visitor = {
        Program: {
            enter(program: utils.traverse.NodePath<Program>) {
                program.traverse({
                    ImportDeclaration(path: utils.traverse.NodePath<ImportDeclaration>) {
                        const source = path.node.source.value;
                        if (source === 'mobx') {
                            if (
                                path.node.specifiers.some(
                                    (it: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier) =>
                                        t.isImportSpecifier(it) && it.imported.name === 'observable',
                                )
                            ) {
                                typesHasImported = true;
                            }
                        }
                    },
                    // MemberExpression(path: utils.traverse.NodePath<MemberExpression>) {
                    //   if (t.isIdentifier(path.node.object) && t.isIdentifier(path.node.property)) {
                    //     if (path.node.object.name === 'types' && path.node.property.name === 'model') {
                    //       modelHasDefined = true;
                    //     }
                    //   }
                    // },
                });
            },
            exit(program: utils.traverse.NodePath<Program>) {
                // if (typesHasImported && modelHasDefined) {
                if (typesHasImported) {
                    program.traverse({
                        ExportDefaultDeclaration(path: utils.traverse.NodePath<ExportDefaultDeclaration>) {
                            const declaration = path.node.declaration;
                            if (t.isNewExpression(declaration) || t.isIdentifier(declaration)) {
                                modelInstanceHasExported = true;
                            }
                        },
                    });
                }
            },
        },
    };

    traverse.default(ast, visitor);

    // return typesHasImported && modelHasDefined && modelInstanceHasExported;
    return typesHasImported && modelInstanceHasExported;
}
