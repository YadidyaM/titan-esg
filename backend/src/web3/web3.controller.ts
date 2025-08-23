import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Web3Service } from './web3.service';
import { ethers } from 'ethers';

@ApiTags('Web3')
@Controller('web3')
export class Web3Controller {
  constructor(private readonly web3Service: Web3Service) {}

  @Get('network-info')
  @ApiOperation({ summary: 'Get blockchain network information' })
  @ApiResponse({ status: 200, description: 'Network information retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Failed to get network information' })
  async getNetworkInfo() {
    try {
      return await this.web3Service.getNetworkInfo();
    } catch (error) {
      throw new HttpException(
        `Failed to get network info: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('wallet-balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiResponse({ status: 200, description: 'Wallet balance retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Failed to get wallet balance' })
  async getWalletBalance() {
    try {
      return await this.web3Service.getWalletBalance();
    } catch (error) {
      throw new HttpException(
        `Failed to get wallet balance: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('contract-balance')
  @ApiOperation({ summary: 'Get carbon credit contract balance' })
  @ApiResponse({ status: 200, description: 'Contract balance retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Failed to get contract balance' })
  async getContractBalance() {
    try {
      return await this.web3Service.getContractBalance();
    } catch (error) {
      throw new HttpException(
        `Failed to get contract balance: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('mint-carbon-credits')
  @ApiOperation({ summary: 'Mint carbon credits' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'string', description: 'Amount of carbon credits to mint' },
        toAddress: { type: 'string', description: 'Address to mint credits to (optional, defaults to wallet address)' }
      },
      required: ['amount']
    }
  })
  @ApiResponse({ status: 201, description: 'Carbon credits minted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 500, description: 'Failed to mint carbon credits' })
  async mintCarbonCredits(
    @Body('amount') amount: string,
    @Body('toAddress') toAddress?: string,
  ) {
    try {
      if (!amount || isNaN(Number(amount))) {
        throw new HttpException('Invalid amount', HttpStatus.BAD_REQUEST);
      }

      return await this.web3Service.mintCarbonCredits(amount, toAddress);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to mint carbon credits: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('transfer-carbon-credits')
  @ApiOperation({ summary: 'Transfer carbon credits' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        toAddress: { type: 'string', description: 'Address to transfer credits to' },
        amount: { type: 'string', description: 'Amount of carbon credits to transfer' }
      },
      required: ['toAddress', 'amount']
    }
  })
  @ApiResponse({ status: 201, description: 'Carbon credits transferred successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 500, description: 'Failed to transfer carbon credits' })
  async transferCarbonCredits(
    @Body('toAddress') toAddress: string,
    @Body('amount') amount: string,
  ) {
    try {
      if (!toAddress || !ethers.isAddress(toAddress)) {
        throw new HttpException('Invalid toAddress', HttpStatus.BAD_REQUEST);
      }

      if (!amount || isNaN(Number(amount))) {
        throw new HttpException('Invalid amount', HttpStatus.BAD_REQUEST);
      }

      return await this.web3Service.transferCarbonCredits(toAddress, amount);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to transfer carbon credits: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
