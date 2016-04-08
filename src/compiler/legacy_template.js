'use strict';var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var di_1 = require('angular2/src/core/di');
var lang_1 = require('angular2/src/facade/lang');
var html_ast_1 = require('./html_ast');
var html_parser_1 = require('./html_parser');
var util_1 = require('./util');
var LONG_SYNTAX_REGEXP = /^(?:on-(.*)|bindon-(.*)|bind-(.*)|var-(.*))$/ig;
var SHORT_SYNTAX_REGEXP = /^(?:\((.*)\)|\[\((.*)\)\]|\[(.*)\]|#(.*))$/ig;
var VARIABLE_TPL_BINDING_REGEXP = /(\bvar\s+|#)(\S+)/ig;
var TEMPLATE_SELECTOR_REGEXP = /^(\S+)/g;
var SPECIAL_PREFIXES_REGEXP = /^(class|style|attr)\./ig;
var INTERPOLATION_REGEXP = /\{\{.*?\}\}/g;
var SPECIAL_CASES = lang_1.CONST_EXPR([
    'ng-non-bindable',
    'ng-default-control',
    'ng-no-form',
]);
/**
 * Convert templates to the case sensitive syntax
 *
 * @internal
 */
var LegacyHtmlAstTransformer = (function () {
    function LegacyHtmlAstTransformer(dashCaseSelectors) {
        this.dashCaseSelectors = dashCaseSelectors;
        this.rewrittenAst = [];
        this.visitingTemplateEl = false;
    }
    LegacyHtmlAstTransformer.prototype.visitComment = function (ast, context) { return ast; };
    LegacyHtmlAstTransformer.prototype.visitElement = function (ast, context) {
        var _this = this;
        this.visitingTemplateEl = ast.name.toLowerCase() == 'template';
        var attrs = ast.attrs.map(function (attr) { return attr.visit(_this, null); });
        var children = ast.children.map(function (child) { return child.visit(_this, null); });
        return new html_ast_1.HtmlElementAst(ast.name, attrs, children, ast.sourceSpan, ast.startSourceSpan, ast.endSourceSpan);
    };
    LegacyHtmlAstTransformer.prototype.visitAttr = function (originalAst, context) {
        var ast = originalAst;
        if (this.visitingTemplateEl) {
            if (lang_1.isPresent(lang_1.RegExpWrapper.firstMatch(LONG_SYNTAX_REGEXP, ast.name))) {
                // preserve the "-" in the prefix for the long syntax
                ast = this._rewriteLongSyntax(ast);
            }
            else {
                // rewrite any other attribute
                var name_1 = util_1.dashCaseToCamelCase(ast.name);
                ast = name_1 == ast.name ? ast : new html_ast_1.HtmlAttrAst(name_1, ast.value, ast.sourceSpan);
            }
        }
        else {
            ast = this._rewriteTemplateAttribute(ast);
            ast = this._rewriteLongSyntax(ast);
            ast = this._rewriteShortSyntax(ast);
            ast = this._rewriteStar(ast);
            ast = this._rewriteInterpolation(ast);
            ast = this._rewriteSpecialCases(ast);
        }
        if (ast !== originalAst) {
            this.rewrittenAst.push(ast);
        }
        return ast;
    };
    LegacyHtmlAstTransformer.prototype.visitText = function (ast, context) { return ast; };
    LegacyHtmlAstTransformer.prototype._rewriteLongSyntax = function (ast) {
        var m = lang_1.RegExpWrapper.firstMatch(LONG_SYNTAX_REGEXP, ast.name);
        var attrName = ast.name;
        var attrValue = ast.value;
        if (lang_1.isPresent(m)) {
            if (lang_1.isPresent(m[1])) {
                attrName = "on-" + util_1.dashCaseToCamelCase(m[1]);
            }
            else if (lang_1.isPresent(m[2])) {
                attrName = "bindon-" + util_1.dashCaseToCamelCase(m[2]);
            }
            else if (lang_1.isPresent(m[3])) {
                attrName = "bind-" + util_1.dashCaseToCamelCase(m[3]);
            }
            else if (lang_1.isPresent(m[4])) {
                attrName = "var-" + util_1.dashCaseToCamelCase(m[4]);
                attrValue = util_1.dashCaseToCamelCase(attrValue);
            }
        }
        return attrName == ast.name && attrValue == ast.value ?
            ast :
            new html_ast_1.HtmlAttrAst(attrName, attrValue, ast.sourceSpan);
    };
    LegacyHtmlAstTransformer.prototype._rewriteTemplateAttribute = function (ast) {
        var name = ast.name;
        var value = ast.value;
        if (name.toLowerCase() == 'template') {
            name = 'template';
            // rewrite the directive selector
            value = lang_1.StringWrapper.replaceAllMapped(value, TEMPLATE_SELECTOR_REGEXP, function (m) { return util_1.dashCaseToCamelCase(m[1]); });
            // rewrite the var declarations
            value = lang_1.StringWrapper.replaceAllMapped(value, VARIABLE_TPL_BINDING_REGEXP, function (m) {
                return "" + m[1].toLowerCase() + util_1.dashCaseToCamelCase(m[2]);
            });
        }
        if (name == ast.name && value == ast.value) {
            return ast;
        }
        return new html_ast_1.HtmlAttrAst(name, value, ast.sourceSpan);
    };
    LegacyHtmlAstTransformer.prototype._rewriteShortSyntax = function (ast) {
        var m = lang_1.RegExpWrapper.firstMatch(SHORT_SYNTAX_REGEXP, ast.name);
        var attrName = ast.name;
        var attrValue = ast.value;
        if (lang_1.isPresent(m)) {
            if (lang_1.isPresent(m[1])) {
                attrName = "(" + util_1.dashCaseToCamelCase(m[1]) + ")";
            }
            else if (lang_1.isPresent(m[2])) {
                attrName = "[(" + util_1.dashCaseToCamelCase(m[2]) + ")]";
            }
            else if (lang_1.isPresent(m[3])) {
                var prop = lang_1.StringWrapper.replaceAllMapped(m[3], SPECIAL_PREFIXES_REGEXP, function (m) { return m[1].toLowerCase() + '.'; });
                if (prop.startsWith('class.') || prop.startsWith('attr.') || prop.startsWith('style.')) {
                    attrName = "[" + prop + "]";
                }
                else {
                    attrName = "[" + util_1.dashCaseToCamelCase(prop) + "]";
                }
            }
            else if (lang_1.isPresent(m[4])) {
                attrName = "#" + util_1.dashCaseToCamelCase(m[4]);
                attrValue = util_1.dashCaseToCamelCase(attrValue);
            }
        }
        return attrName == ast.name && attrValue == ast.value ?
            ast :
            new html_ast_1.HtmlAttrAst(attrName, attrValue, ast.sourceSpan);
    };
    LegacyHtmlAstTransformer.prototype._rewriteStar = function (ast) {
        var attrName = ast.name;
        var attrValue = ast.value;
        if (attrName[0] == '*') {
            attrName = util_1.dashCaseToCamelCase(attrName);
            // rewrite the var declarations
            attrValue = lang_1.StringWrapper.replaceAllMapped(attrValue, VARIABLE_TPL_BINDING_REGEXP, function (m) {
                return "" + m[1].toLowerCase() + util_1.dashCaseToCamelCase(m[2]);
            });
        }
        return attrName == ast.name && attrValue == ast.value ?
            ast :
            new html_ast_1.HtmlAttrAst(attrName, attrValue, ast.sourceSpan);
    };
    LegacyHtmlAstTransformer.prototype._rewriteInterpolation = function (ast) {
        var hasInterpolation = lang_1.RegExpWrapper.test(INTERPOLATION_REGEXP, ast.value);
        if (!hasInterpolation) {
            return ast;
        }
        var name = ast.name;
        if (!(name.startsWith('attr.') || name.startsWith('class.') || name.startsWith('style.'))) {
            name = util_1.dashCaseToCamelCase(ast.name);
        }
        return name == ast.name ? ast : new html_ast_1.HtmlAttrAst(name, ast.value, ast.sourceSpan);
    };
    LegacyHtmlAstTransformer.prototype._rewriteSpecialCases = function (ast) {
        var attrName = ast.name;
        if (SPECIAL_CASES.indexOf(attrName) > -1) {
            return new html_ast_1.HtmlAttrAst(util_1.dashCaseToCamelCase(attrName), ast.value, ast.sourceSpan);
        }
        if (lang_1.isPresent(this.dashCaseSelectors) && this.dashCaseSelectors.indexOf(attrName) > -1) {
            return new html_ast_1.HtmlAttrAst(util_1.dashCaseToCamelCase(attrName), ast.value, ast.sourceSpan);
        }
        return ast;
    };
    return LegacyHtmlAstTransformer;
})();
exports.LegacyHtmlAstTransformer = LegacyHtmlAstTransformer;
var LegacyHtmlParser = (function (_super) {
    __extends(LegacyHtmlParser, _super);
    function LegacyHtmlParser() {
        _super.apply(this, arguments);
    }
    LegacyHtmlParser.prototype.parse = function (sourceContent, sourceUrl) {
        var transformer = new LegacyHtmlAstTransformer();
        var htmlParseTreeResult = _super.prototype.parse.call(this, sourceContent, sourceUrl);
        var rootNodes = htmlParseTreeResult.rootNodes.map(function (node) { return node.visit(transformer, null); });
        return transformer.rewrittenAst.length > 0 ?
            new html_parser_1.HtmlParseTreeResult(rootNodes, htmlParseTreeResult.errors) :
            htmlParseTreeResult;
    };
    LegacyHtmlParser = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], LegacyHtmlParser);
    return LegacyHtmlParser;
})(html_parser_1.HtmlParser);
exports.LegacyHtmlParser = LegacyHtmlParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVnYWN5X3RlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1CYzRtdzZ2WC50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL2xlZ2FjeV90ZW1wbGF0ZS50cyJdLCJuYW1lcyI6WyJMZWdhY3lIdG1sQXN0VHJhbnNmb3JtZXIiLCJMZWdhY3lIdG1sQXN0VHJhbnNmb3JtZXIuY29uc3RydWN0b3IiLCJMZWdhY3lIdG1sQXN0VHJhbnNmb3JtZXIudmlzaXRDb21tZW50IiwiTGVnYWN5SHRtbEFzdFRyYW5zZm9ybWVyLnZpc2l0RWxlbWVudCIsIkxlZ2FjeUh0bWxBc3RUcmFuc2Zvcm1lci52aXNpdEF0dHIiLCJMZWdhY3lIdG1sQXN0VHJhbnNmb3JtZXIudmlzaXRUZXh0IiwiTGVnYWN5SHRtbEFzdFRyYW5zZm9ybWVyLl9yZXdyaXRlTG9uZ1N5bnRheCIsIkxlZ2FjeUh0bWxBc3RUcmFuc2Zvcm1lci5fcmV3cml0ZVRlbXBsYXRlQXR0cmlidXRlIiwiTGVnYWN5SHRtbEFzdFRyYW5zZm9ybWVyLl9yZXdyaXRlU2hvcnRTeW50YXgiLCJMZWdhY3lIdG1sQXN0VHJhbnNmb3JtZXIuX3Jld3JpdGVTdGFyIiwiTGVnYWN5SHRtbEFzdFRyYW5zZm9ybWVyLl9yZXdyaXRlSW50ZXJwb2xhdGlvbiIsIkxlZ2FjeUh0bWxBc3RUcmFuc2Zvcm1lci5fcmV3cml0ZVNwZWNpYWxDYXNlcyIsIkxlZ2FjeUh0bWxQYXJzZXIiLCJMZWdhY3lIdG1sUGFyc2VyLmNvbnN0cnVjdG9yIiwiTGVnYWN5SHRtbFBhcnNlci5wYXJzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQkFBNEMsc0JBQXNCLENBQUMsQ0FBQTtBQUVuRSxxQkFNTywwQkFBMEIsQ0FBQyxDQUFBO0FBRWxDLHlCQU9PLFlBQVksQ0FBQyxDQUFBO0FBQ3BCLDRCQUE4QyxlQUFlLENBQUMsQ0FBQTtBQUU5RCxxQkFBdUQs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QSxTQUFTQSxHQUFHQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQTtRQUUxQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsZ0JBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2pCQSxFQUFFQSxDQUFDQSxDQUFDQSxnQkFBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3BCQSxRQUFRQSxHQUFHQSxRQUFNQSwwQkFBbUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUdBLENBQUNBO1lBQy9DQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxnQkFBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNCQSxRQUFRQSxHQUFHQSxZQUFVQSwwQkFBbUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUdBLENBQUNBO1lBQ25EQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxnQkFBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNCQSxRQUFRQSxHQUFHQSxVQUFRQSwwQkFBbUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUdBLENBQUNBO1lBQ2pEQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxnQkFBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNCQSxRQUFRQSxHQUFHQSxTQUFPQSwwQkFBbUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUdBLENBQUNBO2dCQUM5Q0EsU0FBU0EsR0FBR0EsMEJBQW1CQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtZQUM3Q0EsQ0FBQ0E7UUFDSEEsQ0FB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Q0FBQ0EsQ0FBQ0E7UUFFekZBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLFlBQVlBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBO1lBQy9CQSxJQUFJQSxpQ0FBbUJBLENBQUNBLFNBQVNBLEVBQUVBLG1CQUFtQkEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFDOURBLG1CQUFtQkEsQ0FBQ0E7SUFDakNBLENBQUNBO0lBWEhGO1FBQUNBLGVBQVVBLEVBQUVBOzt5QkFZWkE7SUFBREEsdUJBQUNBO0FBQURBLENBQUNBLEFBWkQsRUFDc0Msd0JBQVUsRUFXL0M7QUFYWSx3QkFBZ0IsbUJBVzVCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGUsIFByb3ZpZGVyLCBwcm92aWRlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5cbmltcG9ydCB7XG4gIFN0cmluZ1dyYXBwZXIsXG4gIFJlZ0V4cFdyYXBwZXIsXG4gIENPTlNUX0VYUFIsXG4gIGlzQmxhbmssXG4gIGlzUHJlc2VudFxufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG5pbXBvcnQge1xuICBIdG1sQXN0VmlzaXRvcixcbiAgSHRtbEF0dHJBc3QsXG4gIEh0bWxFbGVtZW50QXN0LFxuICBIdG1sVGV4dEFzdCxcbiAgSHRtbENvbW1lbnRBc3QsXG4gIEh0bWxBc3Rcbn0gZnJvbSAnLi9odG1sX2FzdCc7XG5pbXBvcnQge0h0bWxQYXJzZXIsIEh0bWxQYXJzZVRyZWVSZXN1bHR9IGZyb20gJy4vaHRtbF9wYXJzZXInO1xuXG5pbXBvcnQge2Rhc2hDYXNlVG9DYW1lbENhc2UsIGNhbWVsQ2FzZVRvRGFzaENhc2V9IGZyb20gJy4vdXRpbCc7XG5cbnZhciBMT05HX1NZTlRBWF9SRUdFWFAgPSAvXig/Om9uLSguKil8YmluZG9uLSguKil8YmluZC0oLiopfHZhci0oLiopKSQvaWc7XG52YXIgU0hPUlRfU1lOVEFYX1JFR0VYUCA9IC9eKD86XFwoKC4qKVxcKXxcXFtcXCgoLiopXFwpXFxdfFxcWyguKilcXF18IyguKikpJC9pZztcbnZhciBWQVJJQUJMRV9UUExfQklORElOR19SRUdFWFAgPSAvKFxcYnZhclxccyt8IykoXFxTKykvaWc7XG52YXIgVEVNUExBVEVfU0VMRUNUT1JfUkVHRVhQID0gL14oXFxTKykvZztcbnZhciBTUEVDSUFMX1BSRUZJWEVTX1JFR0VYUCA9IC9eKGNsYXNzfHN0eWxlfGF0dHIpXFwuL2lnO1xudmFyIElOVEVSUE9MQVRJT05fUkVHRVhQID0gL1xce1xcey4qP1xcfVxcfS9nO1xuXG5jb25zdCBTUEVDSUFMX0NBU0VTID0gQ09OU1RfRVhQUihbXG4gICduZy1ub24tYmluZGFibGUnLFxuICAnbmctZGVmYXVsdC1jb250cm9sJyxcbiAgJ25nLW5vLWZvcm0nLFxuXSk7XG5cbi8qKlxuICogQ29udmVydCB0ZW1wbGF0ZXMgdG8gdGhlIGNhc2Ugc2Vuc2l0aXZlIHN5bnRheFxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgY2xhc3MgTGVnYWN5SHRtbEFzdFRyYW5zZm9ybWVyIGltcGxlbWVudHMgSHRtbEFzdFZpc2l0b3Ige1xuICByZXdyaXR0ZW5Bc3Q6IEh0bWxBc3RbXSA9IFtdO1xuICB2aXNpdGluZ1RlbXBsYXRlRWw6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRhc2hDYXNlU2VsZWN0b3JzPzogc3RyaW5nW10pIHt9XG5cbiAgdmlzaXRDb21tZW50KGFzdDogSHRtbENvbW1lbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBhc3Q7IH1cblxuICB2aXNpdEVsZW1lbnQoYXN0OiBIdG1sRWxlbWVudEFzdCwgY29udGV4dDogYW55KTogSHRtbEVsZW1lbnRBc3Qge1xuICAgIHRoaXMudmlzaXRpbmdUZW1wbGF0ZUVsID0gYXN0Lm5hbWUudG9Mb3dlckNhc2UoKSA9PSAndGVtcGxhdGUnO1xuICAgIGxldCBhdHRycyA9IGFzdC5hdHRycy5tYXAoYXR0ciA9PiBhdHRyLnZpc2l0KHRoaXMsIG51bGwpKTtcbiAgICBsZXQgY2hpbGRyZW4gPSBhc3QuY2hpbGRyZW4ubWFwKGNoaWxkID0+IGNoaWxkLnZpc2l0KHRoaXMsIG51bGwpKTtcbiAgICByZXR1cm4gbmV3IEh0bWxFbGVtZW50QXN0KGFzdC5uYW1lLCBhdHRycywgY2hpbGRyZW4sIGFzdC5zb3VyY2VTcGFuLCBhc3Quc3RhcnRTb3VyY2VTcGFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN0LmVuZFNvdXJjZVNwYW4pO1xuICB9XG5cbiAgdmlzaXRBdHRyKG9yaWdpbmFsQXN0OiBIdG1sQXR0ckFzdCwgY29udGV4dDogYW55KTogSHRtbEF0dHJBc3Qge1xuICAgIGxldCBhc3QgPSBvcmlnaW5hbEFzdDtcblxuICAgIGlmICh0aGlzLnZpc2l0aW5nVGVtcGxhdGVFbCkge1xuICAgICAgaWYgKGlzUHJlc2VudChSZWdFeHBXcmFwcGVyLmZpcnN0TWF0Y2goTE9OR19TWU5UQVhfUkVHRVhQLCBhc3QubmFtZSkpKSB7XG4gICAgICAgIC8vIHByZXNlcnZlIHRoZSBcIi1cIiBpbiB0aGUgcHJlZml4IGZvciB0aGUgbG9uZyBzeW50YXhcbiAgICAgICAgYXN0ID0gdGhpcy5fcmV3cml0ZUxvbmdTeW50YXgoYXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJld3JpdGUgYW55IG90aGVyIGF0dHJpYnV0ZVxuICAgICAgICBsZXQgbmFtZSA9IGRhc2hDYXNlVG9DYW1lbENhc2UoYXN0Lm5hbWUpO1xuICAgICAgICBhc3QgPSBuYW1lID09IGFzdC5uYW1lID8gYXN0IDogbmV3IEh0bWxBdHRyQXN0KG5hbWUsIGFzdC52YWx1ZSwgYXN0LnNvdXJjZVNwYW4pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBhc3QgPSB0aGlzLl9yZXdyaXRlVGVtcGxhdGVBdHRyaWJ1dGUoYXN0KTtcbiAgICAgIGFzdCA9IHRoaXMuX3Jld3JpdGVMb25nU3ludGF4KGFzdCk7XG4gICAgICBhc3QgPSB0aGlzLl9yZXdyaXRlU2hvcnRTeW50YXgoYXN0KTtcbiAgICAgIGFzdCA9IHRoaXMuX3Jld3JpdGVTdGFyKGFzdCk7XG4gICAgICBhc3QgPSB0aGlzLl9yZXdyaXRlSW50ZXJwb2xhdGlvbihhc3QpO1xuICAgICAgYXN0ID0gdGhpcy5fcmV3cml0ZVNwZWNpYWxDYXNlcyhhc3QpO1xuICAgIH1cblxuICAgIGlmIChhc3QgIT09IG9yaWdpbmFsQXN0KSB7XG4gICAgICB0aGlzLnJld3JpdHRlbkFzdC5wdXNoKGFzdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFzdDtcbiAgfVxuXG4gIHZpc2l0VGV4dChhc3Q6IEh0bWxUZXh0QXN0LCBjb250ZXh0OiBhbnkpOiBIdG1sVGV4dEFzdCB7IHJldHVybiBhc3Q7IH1cblxuICBwcml2YXRlIF9yZXdyaXRlTG9uZ1N5bnRheChhc3Q6IEh0bWxBdHRyQXN0KTogSHRtbEF0dHJBc3Qge1xuICAgIGxldCBtID0gUmVnRXhwV3JhcHBlci5maXJzdE1hdGNoKExPTkdfU1lOVEFYX1JFR0VYUCwgYXN0Lm5hbWUpO1xuICAgIGxldCBhdHRyTmFtZSA9IGFzdC5uYW1lO1xuICAgIGxldCBhdHRyVmFsdWUgPSBhc3QudmFsdWU7XG5cbiAgICBpZiAoaXNQcmVzZW50KG0pKSB7XG4gICAgICBpZiAoaXNQcmVzZW50KG1bMV0pKSB7XG4gICAgICAgIGF0dHJOYW1lID0gYG9uLSR7ZGFzaENhc2VUb0NhbWVsQ2FzZShtWzFdKX1gO1xuICAgICAgfSBlbHNlIGlmIChpc1ByZXNlbnQobVsyXSkpIHtcbiAgICAgICAgYXR0ck5hbWUgPSBgYmluZG9uLSR7ZGFzaENhc2VUb0NhbWVsQ2FzZShtWzJdKX1gO1xuICAgICAgfSBlbHNlIGlmIChpc1ByZXNlbnQobVszXSkpIHtcbiAgICAgICAgYXR0ck5hbWUgPSBgYmluZC0ke2Rhc2hDYXNlVG9DYW1lbENhc2UobVszXSl9YDtcbiAgICAgIH0gZWxzZSBpZiAoaXNQcmVzZW50KG1bNF0pKSB7XG4gICAgICAgIGF0dHJOYW1lID0gYHZhci0ke2Rhc2hDYXNlVG9DYW1lbENhc2UobVs0XSl9YDtcbiAgICAgICAgYXR0clZhbHVlID0gZGFzaENhc2VUb0NhbWVsQ2FzZShhdHRyVmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhdHRyTmFtZSA9PSBhc3QubmFtZSAmJiBhdHRyVmFsdWUgPT0gYXN0LnZhbHVlID9cbiAgICAgICAgICAgICAgIGFzdCA6XG4gICAgICAgICAgICAgICBuZXcgSHRtbEF0dHJBc3QoYXR0ck5hbWUsIGF0dHJWYWx1ZSwgYXN0LnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmV3cml0ZVRlbXBsYXRlQXR0cmlidXRlKGFzdDogSHRtbEF0dHJBc3QpOiBIdG1sQXR0ckFzdCB7XG4gICAgbGV0IG5hbWUgPSBhc3QubmFtZTtcbiAgICBsZXQgdmFsdWUgPSBhc3QudmFsdWU7XG5cbiAgICBpZiAobmFtZS50b0xvd2VyQ2FzZSgpID09ICd0ZW1wbGF0ZScpIHtcbiAgICAgIG5hbWUgPSAndGVtcGxhdGUnO1xuXG4gICAgICAvLyByZXdyaXRlIHRoZSBkaXJlY3RpdmUgc2VsZWN0b3JcbiAgICAgIHZhbHVlID0gU3RyaW5nV3JhcHBlci5yZXBsYWNlQWxsTWFwcGVkKHZhbHVlLCBURU1QTEFURV9TRUxFQ1RPUl9SRUdFWFAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobSkgPT4geyByZXR1cm4gZGFzaENhc2VUb0NhbWVsQ2FzZShtWzFdKTsgfSk7XG5cbiAgICAgIC8vIHJld3JpdGUgdGhlIHZhciBkZWNsYXJhdGlvbnNcbiAgICAgIHZhbHVlID0gU3RyaW5nV3JhcHBlci5yZXBsYWNlQWxsTWFwcGVkKHZhbHVlLCBWQVJJQUJMRV9UUExfQklORElOR19SRUdFWFAsIG0gPT4ge1xuICAgICAgICByZXR1cm4gYCR7bVsxXS50b0xvd2VyQ2FzZSgpfSR7ZGFzaENhc2VUb0NhbWVsQ2FzZShtWzJdKX1gO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKG5hbWUgPT0gYXN0Lm5hbWUgJiYgdmFsdWUgPT0gYXN0LnZhbHVlKSB7XG4gICAgICByZXR1cm4gYXN0O1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSHRtbEF0dHJBc3QobmFtZSwgdmFsdWUsIGFzdC5zb3VyY2VTcGFuKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Jld3JpdGVTaG9ydFN5bnRheChhc3Q6IEh0bWxBdHRyQXN0KTogSHRtbEF0dHJBc3Qge1xuICAgIGxldCBtID0gUmVnRXhwV3JhcHBlci5maXJzdE1hdGNoKFNIT1JUX1NZTlRBWF9SRUdFWFAsIGFzdC5uYW1lKTtcbiAgICBsZXQgYXR0ck5hbWUgPSBhc3QubmFtZTtcbiAgICBsZXQgYXR0clZhbHVlID0gYXN0LnZhbHVlO1xuXG4gICAgaWYgKGlzUHJlc2VudChtKSkge1xuICAgICAgaWYgKGlzUHJlc2VudChtWzFdKSkge1xuICAgICAgICBhdHRyTmFtZSA9IGAoJHtkYXNoQ2FzZVRvQ2FtZWxDYXNlKG1bMV0pfSlgO1xuICAgICAgfSBlbHNlIGlmIChpc1ByZXNlbnQobVsyXSkpIHtcbiAgICAgICAgYXR0ck5hbWUgPSBgWygke2Rhc2hDYXNlVG9DYW1lbENhc2UobVsyXSl9KV1gO1xuICAgICAgfSBlbHNlIGlmIChpc1ByZXNlbnQobVszXSkpIHtcbiAgICAgICAgbGV0IHByb3AgPSBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGxNYXBwZWQobVszXSwgU1BFQ0lBTF9QUkVGSVhFU19SRUdFWFAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtKSA9PiB7IHJldHVybiBtWzFdLnRvTG93ZXJDYXNlKCkgKyAnLic7IH0pO1xuXG4gICAgICAgIGlmIChwcm9wLnN0YXJ0c1dpdGgoJ2NsYXNzLicpIHx8IHByb3Auc3RhcnRzV2l0aCgnYXR0ci4nKSB8fCBwcm9wLnN0YXJ0c1dpdGgoJ3N0eWxlLicpKSB7XG4gICAgICAgICAgYXR0ck5hbWUgPSBgWyR7cHJvcH1dYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhdHRyTmFtZSA9IGBbJHtkYXNoQ2FzZVRvQ2FtZWxDYXNlKHByb3ApfV1gO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGlzUHJlc2VudChtWzRdKSkge1xuICAgICAgICBhdHRyTmFtZSA9IGAjJHtkYXNoQ2FzZVRvQ2FtZWxDYXNlKG1bNF0pfWA7XG4gICAgICAgIGF0dHJWYWx1ZSA9IGRhc2hDYXNlVG9DYW1lbENhc2UoYXR0clZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXR0ck5hbWUgPT0gYXN0Lm5hbWUgJiYgYXR0clZhbHVlID09IGFzdC52YWx1ZSA/XG4gICAgICAgICAgICAgICBhc3QgOlxuICAgICAgICAgICAgICAgbmV3IEh0bWxBdHRyQXN0KGF0dHJOYW1lLCBhdHRyVmFsdWUsIGFzdC5zb3VyY2VTcGFuKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Jld3JpdGVTdGFyKGFzdDogSHRtbEF0dHJBc3QpOiBIdG1sQXR0ckFzdCB7XG4gICAgbGV0IGF0dHJOYW1lID0gYXN0Lm5hbWU7XG4gICAgbGV0IGF0dHJWYWx1ZSA9IGFzdC52YWx1ZTtcblxuICAgIGlmIChhdHRyTmFtZVswXSA9PSAnKicpIHtcbiAgICAgIGF0dHJOYW1lID0gZGFzaENhc2VUb0NhbWVsQ2FzZShhdHRyTmFtZSk7XG4gICAgICAvLyByZXdyaXRlIHRoZSB2YXIgZGVjbGFyYXRpb25zXG4gICAgICBhdHRyVmFsdWUgPSBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGxNYXBwZWQoYXR0clZhbHVlLCBWQVJJQUJMRV9UUExfQklORElOR19SRUdFWFAsIG0gPT4ge1xuICAgICAgICByZXR1cm4gYCR7bVsxXS50b0xvd2VyQ2FzZSgpfSR7ZGFzaENhc2VUb0NhbWVsQ2FzZShtWzJdKX1gO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dHJOYW1lID09IGFzdC5uYW1lICYmIGF0dHJWYWx1ZSA9PSBhc3QudmFsdWUgP1xuICAgICAgICAgICAgICAgYXN0IDpcbiAgICAgICAgICAgICAgIG5ldyBIdG1sQXR0ckFzdChhdHRyTmFtZSwgYXR0clZhbHVlLCBhc3Quc291cmNlU3Bhbik7XG4gIH1cblxuICBwcml2YXRlIF9yZXdyaXRlSW50ZXJwb2xhdGlvbihhc3Q6IEh0bWxBdHRyQXN0KTogSHRtbEF0dHJBc3Qge1xuICAgIGxldCBoYXNJbnRlcnBvbGF0aW9uID0gUmVnRXhwV3JhcHBlci50ZXN0KElOVEVSUE9MQVRJT05fUkVHRVhQLCBhc3QudmFsdWUpO1xuXG4gICAgaWYgKCFoYXNJbnRlcnBvbGF0aW9uKSB7XG4gICAgICByZXR1cm4gYXN0O1xuICAgIH1cblxuICAgIGxldCBuYW1lID0gYXN0Lm5hbWU7XG5cbiAgICBpZiAoIShuYW1lLnN0YXJ0c1dpdGgoJ2F0dHIuJykgfHwgbmFtZS5zdGFydHNXaXRoKCdjbGFzcy4nKSB8fCBuYW1lLnN0YXJ0c1dpdGgoJ3N0eWxlLicpKSkge1xuICAgICAgbmFtZSA9IGRhc2hDYXNlVG9DYW1lbENhc2UoYXN0Lm5hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiBuYW1lID09IGFzdC5uYW1lID8gYXN0IDogbmV3IEh0bWxBdHRyQXN0KG5hbWUsIGFzdC52YWx1ZSwgYXN0LnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmV3cml0ZVNwZWNpYWxDYXNlcyhhc3Q6IEh0bWxBdHRyQXN0KTogSHRtbEF0dHJBc3Qge1xuICAgIGxldCBhdHRyTmFtZSA9IGFzdC5uYW1lO1xuXG4gICAgaWYgKFNQRUNJQUxfQ0FTRVMuaW5kZXhPZihhdHRyTmFtZSkgPiAtMSkge1xuICAgICAgcmV0dXJuIG5ldyBIdG1sQXR0ckFzdChkYXNoQ2FzZVRvQ2FtZWxDYXNlKGF0dHJOYW1lKSwgYXN0LnZhbHVlLCBhc3Quc291cmNlU3Bhbik7XG4gICAgfVxuXG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLmRhc2hDYXNlU2VsZWN0b3JzKSAmJiB0aGlzLmRhc2hDYXNlU2VsZWN0b3JzLmluZGV4T2YoYXR0ck5hbWUpID4gLTEpIHtcbiAgICAgIHJldHVybiBuZXcgSHRtbEF0dHJBc3QoZGFzaENhc2VUb0NhbWVsQ2FzZShhdHRyTmFtZSksIGFzdC52YWx1ZSwgYXN0LnNvdXJjZVNwYW4pO1xuICAgIH1cblxuICAgIHJldHVybiBhc3Q7XG4gIH1cbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIExlZ2FjeUh0bWxQYXJzZXIgZXh0ZW5kcyBIdG1sUGFyc2VyIHtcbiAgcGFyc2Uoc291cmNlQ29udGVudDogc3RyaW5nLCBzb3VyY2VVcmw6IHN0cmluZyk6IEh0bWxQYXJzZVRyZWVSZXN1bHQge1xuICAgIGxldCB0cmFuc2Zvcm1lciA9IG5ldyBMZWdhY3lIdG1sQXN0VHJhbnNmb3JtZXIoKTtcbiAgICBsZXQgaHRtbFBhcnNlVHJlZVJlc3VsdCA9IHN1cGVyLnBhcnNlKHNvdXJjZUNvbnRlbnQsIHNvdXJjZVVybCk7XG5cbiAgICBsZXQgcm9vdE5vZGVzID0gaHRtbFBhcnNlVHJlZVJlc3VsdC5yb290Tm9kZXMubWFwKG5vZGUgPT4gbm9kZS52aXNpdCh0cmFuc2Zvcm1lciwgbnVsbCkpO1xuXG4gICAgcmV0dXJuIHRyYW5zZm9ybWVyLnJld3JpdHRlbkFzdC5sZW5ndGggPiAwID9cbiAgICAgICAgICAgICAgIG5ldyBIdG1sUGFyc2VUcmVlUmVzdWx0KHJvb3ROb2RlcywgaHRtbFBhcnNlVHJlZVJlc3VsdC5lcnJvcnMpIDpcbiAgICAgICAgICAgICAgIGh0bWxQYXJzZVRyZWVSZXN1bHQ7XG4gIH1cbn1cbiJdfQ==