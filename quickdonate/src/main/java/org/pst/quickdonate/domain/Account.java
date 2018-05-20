package org.pst.quickdonate.domain;

public class Account {
	private String virtualPaymentAddress;
	
	public Account() {
	}

	public Account(String virtualPaymentAddress) {
		this.virtualPaymentAddress = virtualPaymentAddress;
	}
	
	public String getVirtualPaymentAddress() {
		return virtualPaymentAddress;
	}

	public void setVirtualPaymentAddress(String virtualPaymentAddress) {
		this.virtualPaymentAddress = virtualPaymentAddress;
	}
	
}
