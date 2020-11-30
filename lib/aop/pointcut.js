/*!
 * .______    _______     ___      .______       ______     ___   .__________.
 * (   _  )  (   ____)   /   \     (   _  )     (      )   /   \  (          )
 * |  |_)  ) |  |__     /  ^  \    |  |_)  )   |  ,----'  /  ^  \ `---|  |---`
 * |   _  <  |   __)   /  /_\  \   |      )    |  |      /  /_\  \    |  |
 * |  |_)  ) |  |____ /  _____  \  |  |)  ----.|  `----./  _____  \   |  |
 * (______)  (_______/__/     \__\ ( _| `.____) (______)__/     \__\  |__|
 *
 * Bearcat Pointcut
 * Copyright(c) 2015 fantasyni <fantasyni@163.com>
 * MIT Licensed
 */

var Utils = require('../util/utils');

/**
 * Pointcut constructor function.
 *
 * @api public
 */
var Pointcut = function() {
	this.expression = null;
	this.adviceType = null;
	this.targetExpression = null;
}

/**
 * Pointcut set expression.
 *
 * @param  {String} expression pointcut expression
 * @api public
 */
Pointcut.prototype.setExpression = function(expression) {
	this.expression = expression;
}

/**
 * Pointcut get expression.
 *
 * @param  {String} pointcut expression
 * @api public
 */
Pointcut.prototype.getExpression = function() {
	return this.expression;
}

/**
 * Pointcut set adviceType: before, after, around.
 *
 * @param  {String} adviceType
 * @api public
 */
Pointcut.prototype.setAdviceType = function(adviceType) {
	this.adviceType = adviceType;
}

/**
 * Pointcut get adviceType: before, after, around.
 *
 * @param  {String} adviceType
 * @api public
 */
Pointcut.prototype.getAdviceType = function() {
	return this.adviceType;
}

/**
 * Pointcut set target pointcut expression.
 *
 * @param  {String} targetExpression pointcut expression
 * @api public
 */
Pointcut.prototype.setTargetExpression = function(targetExpression) {
	this.targetExpression = Utils.checkString(targetExpression) ? new RegExp(targetExpression) : targetExpression;
}

/**
 * Pointcut get target pointcut expression.
 *
 * @return  {String} target pointcut expression
 * @api public
 */
Pointcut.prototype.getTargetExpression = function() {
	return this.targetExpression;
}

/**
 * Pointcut parse pointcut expression.
 *
 * @api public
 */
Pointcut.prototype.parse = function() {
	var expression = this.getExpression();
	if (!expression) {
		return;
	}

	if (Utils.checkString(expression)) {
		var r = expression.split(':');
		if (Utils.checkArray(r) && r.length === 2) {
			this.setAdviceType(r[0]);
			this.setTargetExpression(r[1]);
		}
	} else {
		this.setAdviceType(expression['type']);
		this.setTargetExpression(expression['expressions'] || []);
	}
}

/**
 * Pointcut check whether pointcut match targetMethod.
 *
 * @param  {String} targetMethod target method name
 * @api public
 */
Pointcut.prototype.match = function(targetMethod) {
	var targetExpression = this.getTargetExpression();


	return matchResult(targetMethod, targetExpression);
}

function matchResult (targetMethod, targetExpressions) {
	if (!Utils.checkArray(targetExpressions)) {
		targetExpressions = [targetExpressions];
	}

	let result = !!targetExpressions.length;

	targetExpressions.forEach(exprInfo => {
		let negative = exprInfo['negative'];
		let isAnd = exprInfo['operator'] === '&&';
		let expr = exprInfo['expr'];
		if (Utils.checkString(exprInfo) || Utils.checkRegExp(exprInfo)) {
			negative = false;
			isAnd = true;
			expr = exprInfo;
		}

		let subRes = negative ? !targetMethod.match(expr) : targetMethod.match(expr);
		result = isAnd ? result && subRes : result || subRes;
	});

	return result;
}

module.exports = Pointcut;
