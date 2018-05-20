package org.pst.quickdonate.domain;

public class Wish {
	private String id;
	private String message;
	private String beneficiaryName;
	//@JsonIgnore
	private String beneficiaryAadharId;
	//@JsonIgnore
	private Account beneficiaryAccount;
	private double amount;
	private boolean isActive = true;
	private boolean isFulfilled = false;
	
	public Wish() {
	}
	
	public Wish(String id, String message, String beneficiaryAadharId, Account beneficiaryAccount, double amount, boolean isActive, boolean isFulfilled) {
		this.id = id;
		this.message = message;
		this.beneficiaryAadharId = beneficiaryAadharId;
		this.beneficiaryAccount = beneficiaryAccount;
		this.amount = amount;
		this.isActive = isActive;
		this.isFulfilled = isFulfilled;
	}

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getBeneficiaryName() {
		return beneficiaryName;
	}
	public void setBeneficiaryName(String beneficiaryName) {
		this.beneficiaryName = beneficiaryName;
	}
	public String getBeneficiaryAadharId() {
		return beneficiaryAadharId;
	}
	public void setBeneficiaryAadharId(String beneficiaryAadharId) {
		this.beneficiaryAadharId = beneficiaryAadharId;
	}

	public Account getBeneficiaryAccount() {
		return beneficiaryAccount;
	}
	public void setBeneficiaryAccount(Account beneficiaryAccount) {
		this.beneficiaryAccount = beneficiaryAccount;
	}
	public double getAmount() {
		return amount;
	}
	public void setAmount(double amount) {
		this.amount = amount;
	}
	public boolean getIsActive() {
		return isActive;
	}
	public void setIsActive(boolean isActive) {
		this.isActive = isActive;
	}
	public boolean getIsFulfilled() {
		return isFulfilled;
	}
	public void setIsFulfilled(boolean isFulfilled) {
		this.isFulfilled = isFulfilled;
	}
}
